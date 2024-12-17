import os
import logging
from typing import List, Dict, Any
import torch
from moviepy.editor import VideoFileClip, ImageClip, CompositeVideoClip, ColorClip
import whisper
import srt
from datetime import timedelta
from PIL import Image, ImageDraw, ImageFont
import numpy as np
from tqdm import tqdm
import tiktoken
import textwrap
import argparse

class Config:
    # Paths
    FONT_PATH = os.getenv('FONT_PATH', "/font/DejaVuSans-Bold.ttf")
    JAPANESE_FONT_PATH = os.getenv('JAPANESE_FONT_PATH', "/font/NotoSansCJKBold.otf")
    TEMP_AUDIO_FILE = os.getenv('TEMP_AUDIO_FILE', "audio_tts.wav")

    # Video processing
    DEFAULT_SUBTITLE_HEIGHT = int(os.getenv('DEFAULT_SUBTITLE_HEIGHT', 200))
    DEFAULT_FONT_SIZE = int(os.getenv('DEFAULT_FONT_SIZE', 32))
    MAX_SUBTITLE_LINES = int(os.getenv('MAX_SUBTITLE_LINES', 3))

    # Video encoding
    VIDEO_CODEC = os.getenv('VIDEO_CODEC', 'libx264')
    AUDIO_CODEC = os.getenv('AUDIO_CODEC', 'aac')
    VIDEO_PRESET = os.getenv('VIDEO_PRESET', 'medium')
    CRF = os.getenv('CRF', '23')
    PIXEL_FORMAT = os.getenv('PIXEL_FORMAT', 'yuv420p')

    # Tiktoken related settings
    TIKTOKEN_MODEL = "cl100k_base"
    MAX_TOKENS_PER_CHUNK = 4000

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SubtitleProcessor:
    def __init__(self, video_path: str, srt_path: str):
        self.video_path = video_path
        self.srt_path = srt_path
        self.temp_files = []

    def cleanup_temp_files(self):
        logger.info("Cleaning up temporary files...")
        for file_path in self.temp_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Removed temporary file: {file_path}")
            except Exception as e:
                logger.error(f"Error removing {file_path}: {e}")

class SRTGenerator(SubtitleProcessor):
    def __init__(self, video_path: str, output_srt: str, model_name: str, language: str = "japanese", translate: bool = False):
        super().__init__(video_path, output_srt)
        self.model_name = model_name
        self.translate = translate
        self.tokenizer = tiktoken.get_encoding(Config.TIKTOKEN_MODEL)
        self.language = language

    def run(self):
        try:
            # self.extract_audio()
            transcription = self.transcribe_audio()
            chunks = self.split_into_chunks(transcription)
            results = self.process_chunks(chunks)
            self.create_srt(results)
            logger.info(f"SRT file has been generated: {self.srt_path}")
        finally:
            self.cleanup_temp_files()

    def extract_audio(self):
        logger.info("Extracting audio from video...")
        video = VideoFileClip(self.video_path)
        video.audio.write_audiofile(Config.TEMP_AUDIO_FILE)
        self.temp_files.append(Config.TEMP_AUDIO_FILE)

    def transcribe_audio(self) -> Dict[str, Any]:
        logger.info("Transcribing audio with Whisper...")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {device}")
        logger.info(f"Loading Whisper model: {self.model_name}")
        model = whisper.load_model(self.model_name).to(device)

        task = "translate" if self.translate else "transcribe"
        logger.info(f"Performing task: {task} with language: {self.language}")
        result = model.transcribe(Config.TEMP_AUDIO_FILE, task=task, language=self.language)
        return result

    def split_into_chunks(self, transcription: Dict[str, Any]) -> List[Dict[str, Any]]:
        logger.info("Splitting transcription into chunks...")
        chunks = []
        current_chunk = {"text": "", "segments": []}
        current_tokens = 0

        for segment in transcription['segments']:
            segment_tokens = self.tokenizer.encode(segment['text'])
            if current_tokens + len(segment_tokens) > Config.MAX_TOKENS_PER_CHUNK:
                chunks.append(current_chunk)
                current_chunk = {"text": "", "segments": []}
                current_tokens = 0
            
            current_chunk['text'] += segment['text'] + " "
            current_chunk['segments'].append(segment)
            current_tokens += len(segment_tokens)

        if current_chunk['segments']:
            chunks.append(current_chunk)

        return chunks

    def process_chunks(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        logger.info("Processing chunks...")
        results = []
        for chunk in tqdm(chunks, desc="Processing chunks"):
            results.extend(chunk['segments'])
        return results

    def create_srt(self, results: List[Dict[str, Any]]):
        logger.info("Creating SRT file...")
        subs = []
        for i, segment in enumerate(results, start=1):
            start = timedelta(seconds=segment['start'])
            end = timedelta(seconds=segment['end'])
            text = segment['text']
            sub = srt.Subtitle(index=i, start=start, end=end, content=text)
            subs.append(sub)
        
        with open(self.srt_path, 'w', encoding='utf-8') as f:
            f.write(srt.compose(subs))

class SubtitleAdder(SubtitleProcessor):
    def __init__(self, video_path: str, output_video: str, input_srt: str, subtitle_height: int = Config.DEFAULT_SUBTITLE_HEIGHT):
        super().__init__(video_path, input_srt)
        self.output_video = output_video
        self.subtitle_height = subtitle_height

    def run(self):
        try:
            subs = self.load_srt(self.srt_path)
            self.add_subtitles_to_video(subs)
            logger.info(f"Video with subtitles has been generated: {self.output_video}")
        finally:
            self.cleanup_temp_files()

    @staticmethod
    def load_srt(srt_path: str) -> List[srt.Subtitle]:
        logger.info(f"Loading SRT file: {srt_path}")
        with open(srt_path, 'r', encoding='utf-8') as f:
            return list(srt.parse(f.read()))

    def add_subtitles_to_video(self, subs: List[srt.Subtitle]):
        logger.info(f"Adding subtitles to video with subtitle space height of {self.subtitle_height} pixels...")
        video = VideoFileClip(self.video_path)
        
        original_width, original_height = video.w, video.h
        new_height = original_height + self.subtitle_height
        
        background = ColorClip(size=(original_width, new_height), color=(0,0,0), duration=video.duration)
        video_clip = video.set_position((0, 0))
        
        subtitle_clips = [
            self.create_subtitle_clip(sub.content, original_width)
                .set_start(sub.start.total_seconds())
                .set_end(sub.end.total_seconds())
                .set_position((0, original_height))
            for sub in subs
        ]
        
        final_video = CompositeVideoClip([background, video_clip] + subtitle_clips, size=(original_width, new_height))
        final_video = final_video.set_duration(video.duration)
        
        final_video.write_videofile(
            self.output_video, 
            codec=Config.VIDEO_CODEC, 
            audio_codec=Config.AUDIO_CODEC,
            preset=Config.VIDEO_PRESET,
            ffmpeg_params=['-crf', Config.CRF, '-pix_fmt', Config.PIXEL_FORMAT],
            verbose=False,
            logger=None
        )

    @staticmethod
    def create_subtitle_clip(txt: str, video_width: int, font_size: int = Config.DEFAULT_FONT_SIZE, max_lines: int = Config.MAX_SUBTITLE_LINES) -> ImageClip:
        if any(ord(char) > 127 for char in txt):
            font_path = Config.JAPANESE_FONT_PATH
        else:
            font_path = Config.FONT_PATH

        try:
            font = ImageFont.truetype(font_path, font_size)
        except IOError:
            logger.warning(f"Failed to load font from {font_path}. Falling back to default font.")
            font = ImageFont.load_default()
        
        max_char_count = int(video_width / (font_size * 0.6))
        wrapped_text = textwrap.fill(txt, width=max_char_count)
        lines = wrapped_text.split('\n')[:max_lines]
        
        dummy_img = Image.new('RGB', (video_width, font_size * len(lines)))
        dummy_draw = ImageDraw.Draw(dummy_img)
        max_line_width = max(dummy_draw.textbbox((0, 0), line, font=font)[2] for line in lines)
        total_height = sum(dummy_draw.textbbox((0, 0), line, font=font)[3] for line in lines)
        
        img_width, img_height = video_width, total_height + 20
        img = Image.new('RGBA', (img_width, img_height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        y_text = 10
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            x_text = (img_width - bbox[2]) // 2
            
            for adj in range(-2, 3):
                for adj2 in range(-2, 3):
                    draw.text((x_text+adj, y_text+adj2), line, font=font, fill=(0, 0, 0, 255))
            
            draw.text((x_text, y_text), line, font=font, fill=(255, 255, 255, 255))
            y_text += bbox[3]
        
        return ImageClip(np.array(img))



