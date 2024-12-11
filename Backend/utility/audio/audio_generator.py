import edge_tts

async def generate_audio(text, outputFilename):
    
    # Use a Japanese voice
    communicate = edge_tts.Communicate(text, "ja-JP-NanamiNeural")  
    await communicate.save(outputFilename)