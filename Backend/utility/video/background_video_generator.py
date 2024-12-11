import os
import requests
from utility.utils import log_response, LOG_TYPE_PEXEL

PEXELS_API_KEY = os.environ.get('PEXELS_KEY')


def search_videos(query_string, orientation_landscape=True):
    """
    Searches for videos on the Pexels API based on the query string and orientation.
    Logs the response and returns the JSON data.
    """
    url = "https://api.pexels.com/videos/search"
    headers = {
        "Authorization": PEXELS_API_KEY,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    params = {
        "query": query_string,
        "orientation": "landscape" if orientation_landscape else "portrait",
        "per_page": 15
    }

    response = requests.get(url, headers=headers, params=params)
    
    # Log status and response content
    print(f"Status Code: {response.status_code}")
    print(f"Response Content: {response.text}")
    
    # Check if the response was successful
    if response.status_code != 200:
        raise RuntimeError(f"API request failed with status code {response.status_code}: {response.text}")
    
    json_data = response.json()
    log_response(LOG_TYPE_PEXEL, query_string, json_data)
    
    return json_data


def getBestVideo(query_string, orientation_landscape=True, used_vids=[]):
    """
    Fetches the best video URL from the Pexels API for a given query.
    Filters videos based on resolution and aspect ratio.
    """
    vids = search_videos(query_string, orientation_landscape)
    
    # Handle missing or empty 'videos' key
    if 'videos' not in vids or not vids['videos']:
        print(f"No videos found for query: {query_string}")
        return None

    videos = vids['videos']

    # Filter videos based on resolution and aspect ratio
    if orientation_landscape:
        filtered_videos = [video for video in videos if video['width'] >= 1920 and video['height'] >= 1080 and video['width'] / video['height'] == 16 / 9]
    else:
        filtered_videos = [video for video in videos if video['width'] >= 1080 and video['height'] >= 1920 and video['height'] / video['width'] == 16 / 9]

    # Sort videos by duration (closest to 15 seconds)
    sorted_videos = sorted(filtered_videos, key=lambda x: abs(15 - int(x['duration'])))

    # Extract the top video URL
    for video in sorted_videos:
        for video_file in video['video_files']:
            if orientation_landscape:
                if video_file['width'] == 1920 and video_file['height'] == 1080:
                    if not (video_file['link'].split('.hd')[0] in used_vids):
                        return video_file['link']
            else:
                if video_file['width'] == 1080 and video_file['height'] == 1920:
                    if not (video_file['link'].split('.hd')[0] in used_vids):
                        return video_file['link']

    print(f"No suitable videos found for query: {query_string}")
    return None


def generate_video_url(timed_video_searches, video_server):
    """
    Generates video URLs for timed searches based on the specified video server.
    Supports Pexels and Stable Diffusion.
    """
    timed_video_urls = []
    
    if video_server == "pexel":
        used_links = []
        for (t1, t2), search_terms in timed_video_searches:
            url = ""
            for query in search_terms:
                url = getBestVideo(query, orientation_landscape=True, used_vids=used_links)
                if url:
                    used_links.append(url.split('.hd')[0])
                    break
            timed_video_urls.append([[t1, t2], url])
    
    elif video_server == "stable_diffusion":
        # Placeholder for Stable Diffusion video generation logic
        timed_video_urls = get_images_for_video(timed_video_searches)

    return timed_video_urls
