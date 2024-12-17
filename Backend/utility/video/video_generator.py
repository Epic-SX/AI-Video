import os
import requests
import numpy as np
from io import BytesIO
from PIL import Image
from moviepy.editor import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
)    

# Function to generate the final video from image URLs
def get_final_video(image_urls, audio_file):
    video_clips = []

    # Step 1: Load the audio file
    if not os.path.exists(audio_file):
        raise FileNotFoundError(f"Audio file not found: {audio_file}")
    audio_clip = AudioFileClip(audio_file)

    # Step 2: Calculate duration per image
    duration_per_image = audio_clip.duration / len(image_urls)

    # Step 3: Create video clips for each image URL
    for url in image_urls:
        try:
            # Download the image from the URL
            image_response = requests.get(url)
            image = Image.open(BytesIO(image_response.content))

            # Ensure image is in RGB format
            image = image.convert("RGB")

            # Convert the PIL Image to a NumPy array
            image_np = np.array(image)

            # Create an ImageClip for each image in memory
            video_clip = ImageClip(image_np, duration=duration_per_image)
            video_clips.append(video_clip)
        except Exception as e:
            print(f"An error occurred for image URL '{url}': {e}")
            continue

    # Step 4: Concatenate video clips
    final_video_clip = concatenate_videoclips(video_clips, method="compose")

    # Step 5: Set the audio to the video
    final_video_clip = final_video_clip.set_audio(audio_clip)

    # Step 6: Write the final video to a file
    output_path = "output_video.mp4"
    final_video_clip.write_videofile(output_path, fps=24, codec="libx264")

    # Close the video clip to release resources
    final_video_clip.close()

    return output_path
