from flask import send_file, jsonify
import asyncio
from utility.script.script_generator import generate_script
from utility.audio.audio_generator import generate_audio
from utility.captions.timed_captions_generator import SRTGenerator
from utility.image.image_generator import parse_srt_file, image_generator
from utility.video.video_generator import get_final_video

async def generate_video_from_topic(topic):
    SAMPLE_FILE_NAME = "audio_tts.wav"
    OUTPUT_SRT_PATH = "generated_subtitles.srt"
    MODEL_NAME = "small"
    LANGUAGE = "japanese"
    PROMPTS = parse_srt_file(OUTPUT_SRT_PATH)
    IMAGES_DIR = "output_images"
    AUDIO_FILE = "audio_tts.wav"

    # Generate the script
    response = generate_script(topic)
    print(f"Script generated: {response}")

    # Generate audio
    await generate_audio(response, SAMPLE_FILE_NAME)

    # Generate timed captions
    try:
        caption_generator = SRTGenerator(
            video_path=SAMPLE_FILE_NAME,
            output_srt=OUTPUT_SRT_PATH,
            model_name=MODEL_NAME,
            language=LANGUAGE
        )
        timed_caption = caption_generator.run()
        print(timed_caption)

    except Exception as e:
        print(f"Error generating captions: {e}")
        return None

    # Ensure image generation is awaited if it’s async
    image_urls = image_generator(PROMPTS, image_size="1024x1024")
    
    try:
        # Generate the final video from image URLs
        output_video_path = get_final_video(image_urls, AUDIO_FILE)

        # Return the video file as a response
        return send_file(output_video_path, mimetype="video/mp4")

    except Exception as e:
        return jsonify({"error": str(e)}), 500