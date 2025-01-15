import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI")
client = OpenAI(api_key=OPENAI_API_KEY)

# Create a mapping dictionary
voice_mapping = {
    "ミナト": "alloy",
    "ユリコ": "coral",
    "マサコ": "nova",
    "リョウスケ": "echo",
    "タカユキ": "onyx",
    "ホノカ": "sage",
    "ヒロミ": "shimmer",
    "タクヤ": "ash",
    "ナオキ": "fable"
}

async def generate_audio(text, audio, outputFilename):
    # Get the voice model from the mapping dictionary
    voice_model = voice_mapping.get(audio, "default_voice_model")  # Use a default model if the audio name is not found

    response = client.audio.speech.create(
        model="tts-1-hd",
        voice=voice_model,
        input=text,
    )

    response.stream_to_file(outputFilename)