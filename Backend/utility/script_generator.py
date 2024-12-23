from utility.script.script_generator import generate_script

async def generate_script_from_topic(topic):

    try:
        response = generate_script(topic)
        print(f"Script generated: {response}")

        return response

    except Exception as e:
        raise RuntimeError(f"Error generating video: {str(e)}")