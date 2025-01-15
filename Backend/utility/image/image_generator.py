from openai import OpenAI
from PIL import Image
import io
import requests
import os

# Function to parse the .srt file and extract prompts
def parse_srt_file(srt_file_path):
    prompts = []
    with open(srt_file_path, "r", encoding="utf-8") as file:
        for line in file:
            # Only append lines that are not numeric or timestamps
            if not line.strip().isdigit() and "-->" not in line:
                prompts.append(line.strip())
    # Remove empty strings from the list
    prompts = [prompt for prompt in prompts if prompt]
    return prompts

# Function to generate images based on prompts
def image_generator(prompts, style, image_size="1024x1024"):
    """
    Generate images using OpenAI's DALL-E API based on provided prompts.

    Args:
        prompts (list): List of text prompts to generate images.
        image_size (str): Size of the generated images (e.g., "512x512").
    """
    client = OpenAI(api_key=os.getenv("OPENAI"))

    images = []
    for prompt in prompts:
        try:
            # Modify the prompt to emphasize Japanese text
            japanese_prompt = f"{prompt}({style}画像をください) (日本語のテキストを使用して、画像の内容に日本語を含めてください)"
            
            # Call OpenAI's API to generate an image based on the modified prompt
            response = client.images.generate(
                prompt=japanese_prompt,
                model="dall-e-3",  # Set the model to DALL-E 3
                n=1,  # Number of images to generate
                quality="hd",
                size=image_size,
            )

            # Get the image URL from the response
            image_url = response.data[0].url
            images.append(image_url)
            print(f"Generated image URL: {image_url}")

        except Exception as e:
            print(f"An error occurred for prompt '{prompt}': {e}")

    return images  # Return a list of image URLs
