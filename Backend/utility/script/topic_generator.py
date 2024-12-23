import os
from openai import OpenAI
import json
import re
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI")

model = "gpt-4o"
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_script(topic):
    prompt = (
        """You are a seasoned content writer for a YouTube Shorts channel, specializing in facts videos. 
        Your facts shorts are concise, each lasting less than 50 seconds (approximately 140 words). 
        They are incredibly engaging and original. When a user requests a specific type of facts short, you will create it.
        
        You must create the script in Native Japanese like below

        For instance, if the user asks for:
        
        情報提供動画スタイル
        この動画は自信を持って話し、時には質問を投げかけるスタイルです。
        次のようなコンテンツを作成します。
        日本驚くべき伝統文化, 中国の面白い食べ物習慣, タイの珍しいお祭りとその由来, インドの不思議な習慣と宗教行事, 日本の不思議な風習, アニメに隠されたメッセージ, 新しいカフェ文化のトレンド, 日本の伝説的な生き物たち

        Stictly output the script in a JSON format like below, and only provide a parsable JSON object with the key 'script'. 

        # Output
        {"script": "Here is the script ..."}
        """
    )

    response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": topic}
            ]
        )

    content = response.choices[0].message.content

    # Sanitize the response by escaping problematic characters
    sanitized_content = re.sub(r'[\x00-\x1F\x7F]', '', content)  # Removes control characters

    try:
        # Extract only the JSON object using regex
        match = re.search(r"\{.*\}", sanitized_content, re.DOTALL)
        if match:
            json_str = match.group()
            script = json.loads(json_str)["script"]
        else:
            raise ValueError("No valid JSON found in the response.")
    except Exception as e:
        print("Failed to parse JSON:", e)
        # Print problematic content for debugging
        print("Response content:", content)
        return None

    return script
