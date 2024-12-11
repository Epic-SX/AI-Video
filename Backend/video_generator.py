from openai import OpenAI
import edge_tts
import json
import asyncio
import whisper_timestamped as whisper
from utility.script.script_generator import generate_script
from utility.audio.audio_generator import generate_audio
from utility.captions.timed_captions_generator import generate_timed_captions
from utility.video.background_video_generator import generate_video_url
from utility.render.render_engine import get_output_media
from utility.video.video_search_query_generator import getVideoSearchQueriesTimed, merge_empty_intervals

async def generate_video_from_topic(topic):
    SAMPLE_FILE_NAME = "audio_tts.wav"
    VIDEO_SERVER = "pexel"

    # Generate the script
    response = generate_script(topic)
    print("script: {}".format(response))

    # return response

    # Continue with synchronous audio, captions, video generation if necessary


    # Generate audio
    await generate_audio(response, SAMPLE_FILE_NAME)

    # Generate timed captions
    timed_captions = generate_timed_captions(SAMPLE_FILE_NAME)
    print(timed_captions)

    # Get search terms for video clips
    search_terms = getVideoSearchQueriesTimed(response, timed_captions)
    print(search_terms)

    # Get background video URLs
    background_video_urls = None
    if search_terms is not None:
        background_video_urls = generate_video_url(search_terms, VIDEO_SERVER)
        print(background_video_urls)
    else:
        print("No background video")

    # Merge empty intervals
    background_video_urls = merge_empty_intervals(background_video_urls)

    # Generate final video
    if background_video_urls is not None:
        video = get_output_media(SAMPLE_FILE_NAME, timed_captions, background_video_urls, VIDEO_SERVER)
        print(video)
        return video  # Return the video file path or URL
    else:
        print("No video")
        return None

