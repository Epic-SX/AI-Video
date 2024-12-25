import os
from openai import OpenAI
import json
import re
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI")

model = "gpt-4o"
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_topic_from_style(topic):
    prompt = (
        """You are a seasoned content writer for a YouTube Shorts channel, specializing in facts videos. 
        Your facts shorts are concise, each lasting less than 50 seconds (approximately 140 words). 
        They are incredibly engaging and original. When a user requests a specific type of facts short, you will create it.
        
        You must create the script in Native Japanese like below

        For instance, if the user asks for:
        
        「情報提供動画スタイル」の場合は、「日本の素敵な伝統文化」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。     

        「こども向け学習動画スタイル」の場合は、「野菜の正しい洗い方 - 新鮮さを保とう！」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。 
               
        「ホラー映像スタイル」の場合は、「夜中に電話してきた見知らぬ声の正体」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。 
        
        「ドキュメンタリースタイル」の場合は、「気候変動の影響とその対策」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。 
        
        「クオート動画スタイル」の場合は、「マハトマ・ガンジーの名言：真実と非暴力の力」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。 
  
        「MBTI動画スタイル」の場合は、「ENFJのカリスマ性が際立つ瞬間」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。 
        
        「製品プロモーションビデオのスタイル」の場合は、「収納が簡単で使いやすい多機能トラベルポーチ」と同じ形式で他の4～5個のテーマのみ作成してください。内容は必要ない。 
        
        
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
