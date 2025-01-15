from utility.script.script_generator import generate_script
from utility.audio.audio_generator import generate_audio
from utility.captions.timed_captions_generator import SRTGenerator
from utility.image.image_generator import parse_srt_file, image_generator
from utility.video.video_create import get_final_video
import asyncio

async def generate_video_from_topic(script, audio, style):
    SAMPLE_FILE_NAME = "audio_tts.wav"
    OUTPUT_SRT_PATH = "generated_subtitles.srt"
    MODEL_NAME = "small"
    LANGUAGE = "japanese"
    AUDIO_FILE = "audio_tts.wav"

    try:
        await generate_audio(script, audio, SAMPLE_FILE_NAME)

        caption_generator = SRTGenerator(
            video_path=SAMPLE_FILE_NAME,
            output_srt=OUTPUT_SRT_PATH,
            model_name=MODEL_NAME,
            language=LANGUAGE
        )
        srt_content = caption_generator.run()
        print(f"Generated SRT content:\n{srt_content}")

        prompts = parse_srt_file(OUTPUT_SRT_PATH)

        image_urls = image_generator(prompts, style, image_size="1024x1024")

        output_video_path = get_final_video(image_urls, AUDIO_FILE)

        return srt_content

    except Exception as e:
        raise RuntimeError(f"Error generating video: {str(e)}")