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
        srt_content =await generate_video_from_topic(script)
        
        video_path = os.path.join(os.path.dirname(__file__), 'output_video.mp4')

        # Return the generated video
        return srt_content

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
    
@app.route('/video', methods=['GET'])
async def serve_video():
    # Dynamically locate the video file relative to the script
    video_path = os.path.join(os.path.dirname(__file__), 'output_video.mp4')
    
    # Check if the file exists
    if not os.path.exists(video_path):
        print(f"File not found at path: {video_path}")
        return jsonify({"error": "Video file not found"}), 404
    
    # Serve the file if found
    return await send_file(video_path, mimetype='video/mp4')

if __name__ == '__main__':
    app.run(debug=True)
