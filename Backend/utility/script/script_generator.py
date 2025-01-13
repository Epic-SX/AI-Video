import os
from openai import OpenAI
import json
import re
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI")

# if len(GROQ_API_KEY) > 30:
#     from groq import Groq
#     model = "mixtral-8x7b-32768"
#     client = Groq(
#         api_key=GROQ_API_KEY,
#         )
# else:
    
model = "gpt-4o"
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_script(topic):
    prompt = (
        """You are a seasoned content writer for a YouTube Shorts channel, specializing in facts videos. 
        Your facts shorts are concise, each lasting less than 50 seconds (approximately 140 words). 
        They are incredibly engaging and original. When a user requests a specific type of facts short, you will create it.
        
        You must create the script in Native Japanese like below

        For instance, if the user asks for:
        Horror
        You would produce content like this:

        ホラーコンテンツは下にあります
        町外れに、幽霊が出ると誰もが言う古い廃屋があります。かつてそこに住んでいた家族が、ある夜、不思議なことに全員姿を消したそうです。実際に何が起こったのかは誰も知りませんが、夜遅くに窓に奇妙な光がちらつくのを見たという人がいます。通り過ぎるときに、中からかすかなささやき声が聞こえる人もいます。
        ある日、友人グループが、その家で夜を過ごすことを互いに挑発しました。彼らは幽霊の話を信じず、笑い飛ばしました。きしむ玄関のドアを入ると、空気が氷のように冷たく、背筋が凍りました。彼らはそれを無視し、古い家の断熱が悪いせいだと考えました。
        夜が更けるにつれて、奇妙なことが起こり始めました。部屋の隅で影が踊り、誰もいない廊下に足音が響きました。彼らがちょうど出ようとしたとき、友人の一人が廊下に埃をかぶった古い鏡があることに気づきました。覗き込んでも、自分の姿は動かなかった。
        鏡の中に閉じ込められていることに気づいた彼らはパニックに陥り、叫び声は家の不気味な静寂にかき消された。他の者たちは鏡を壊そうとしたが、鏡は鋼鉄の壁のように頑丈だった。そして時計が真夜中を告げると、ささやき声は大きくなり、家の中は不気味なコーラスで満たされた。
        翌朝、友人たちは二度と姿を現さなかった。彼らの魂は鏡の中に永遠に閉じ込められ、古い家の廊下をさまよっていると言う人もいる。そして今日まで、同じ恐ろしい運命に遭遇することを恐れて、誰も町外れの幽霊屋敷に敢えて入ろうとしない。
        次に、ユーザーが要求した「事実」の種類に基づいて、最高の短いスクリプトを作成するという課題が与えられます。
        簡潔で、非常に興味深く、ユニークなものにしてください。

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
