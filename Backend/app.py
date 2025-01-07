from quart import Quart, send_file, jsonify, request
from quart_cors import cors
from utility.video_generator import generate_video_from_topic
from utility.script_generator import generate_script_from_topic
from utility.script.topic_generator import generate_topic_from_style
import os

app = Quart(__name__)
app = cors(app)  # Enable CORS for Quart

@app.route('/api/generate-script', methods=['POST'])
async def generate_script():
    try:
        # Await the JSON body from the request
        data = await request.json
        print(f"Received data: {data}")
        topic = data.get("topic")
        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        # No 'await' here if generate_script_from_topic is synchronous
        script =await generate_script_from_topic(topic)  # Remove await if not async
        
        return script

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-video', methods=['POST'])
async def generate_video():
    try:
        # Await the JSON body from the request
        data = await request.json
        print(f"Received data: {data}")
        script = data.get("script")
        if not script:
            return jsonify({"error": "Topic is required"}), 400

        # Call the asynchronous video generation function
        result =await generate_video_from_topic(script)
        
        srt_content = result.get('srt_content')
        token_obj = result.get('token_obj')
        
        video_path = os.path.join(os.path.dirname(__file__), 'output_video.mp4')

        # Return the generated video
        return jsonify({
            "srt_content": srt_content,
            "token_obj": token_obj
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/generate-topic', methods=['POST'])
async def generate_topic():
    try:
        # Await the JSON body from the request
        data = await request.json
        print(f"Received data: {data}")
        script = data
        if not script:
            return jsonify({"error": "Topic is required"}), 400

        # Call the asynchronous video generation function
        topic = generate_topic_from_style(script)
        print(topic)
        
        # Return the generated video
        return topic

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/video', methods=['POST'])  # Changed to POST to handle dynamic requests
async def serve_video():
    data = await request.get_json()  # Parse JSON input
    srt_content = data.get("srtContent")  # Extract `srtContent`

    if not srt_content:
        return jsonify({"error": "srtContent is required"}), 400

    # Example: Generate or locate a video based on srtContent
    video_path = os.path.join(os.path.dirname(__file__), 'output_video.mp4')  # Replace with dynamic generation logic
    
    # For demonstration, we'll just check for a static file
    if not os.path.exists(video_path):
        return jsonify({"error": "Video file not found"}), 404

    # Return the video file
    return await send_file(video_path, mimetype='video/mp4')

if __name__ == '__main__':
    app.run(debug=True)
