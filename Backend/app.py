from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
from video_generator import generate_video_from_topic
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/generate-video', methods=['POST'])
def generate_video():
    try:
        # Parse the topic from the frontend's request
        data = request.json
        print(f"Received data: {data}")
        topic = data.get("topic")
        if not topic:
            return jsonify({"error": "Topic is required"}), 400

        # Call the asynchronous video generation function using asyncio.run
        output_video = asyncio.run(generate_video_from_topic(topic))

        # Return the generated video URL or file path
        return jsonify({"message": "Video generated successfully!", "script": output_video})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
