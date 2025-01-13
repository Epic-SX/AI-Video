import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI")
client = OpenAI(api_key=OPENAI_API_KEY)


async def generate_audio(text, outputFilename):
    
    response = client.audio.speech.create(
    model="tts-1-hd",
    voice="alloy",
    input=text,
    )

    response.stream_to_file(outputFilename)