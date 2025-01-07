import os
import logging
from typing import List, Dict, Any
import torch
from moviepy.editor import VideoFileClip, ImageClip, CompositeVideoClip, ColorClip
import whisper
import srt
from datetime import timedelta
import numpy as np
from tqdm import tqdm
import tiktoken
from sudachipy import tokenizer, dictionary
import re


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
        # self.extract_audio()  # Uncomment if you need to extract audio separately.
            transcription = self.transcribe_audio()
            chunks = self.split_into_chunks(transcription)
            results = self.process_chunks(chunks)
            srt_content = self.create_srt(results)
            token_obj = self.tokenize_text(srt_content)
            logger.info(f"SRT file has been generated: {self.srt_path}")
            return {'srt_content': srt_content, 'token_obj': token_obj}  # Return the SRT content.
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
        
        srt_content = srt.compose(subs)
        with open(self.srt_path, 'w', encoding='utf-8') as f:
            f.write(srt_content)
        
        return srt_content
    
   
    def tokenize_text(self, srt_content):
        # Create a Sudachi tokenizer instance
        tokenizer_obj = dictionary.Dictionary().create()
        
        # Regular expression to extract numbered blocks (e.g., "1\n00:00:00,000 --> 00:00:07,000\n...")
        blocks = re.findall(r'(\d+)\n[\d:,]+ --> [\d:,]+\n(.+?)(?=\n\d+\n|$)', srt_content, re.S)
        
        # Prepare the list of tokenized results
        result = []
        for number, content in blocks:
            # Remove leading/trailing whitespace from content
            content = content.strip()
            
            # Tokenize the content
            sentence_tokens = tokenizer_obj.tokenize(content, tokenizer.Tokenizer.SplitMode.C)
            token_strs = [m.surface() for m in sentence_tokens]
            
            # Append the block as a dictionary
            result.append({
                'title': token_strs,
                'content': content
            })
        
        return result

