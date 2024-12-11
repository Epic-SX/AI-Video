import whisper_timestamped as whisper
from whisper_timestamped import load_model, transcribe_timestamped
import regex as re  # Use regex instead of re to handle Unicode properties
import textwrap

def generate_timed_captions(audio_filename, model_size="base"):
    """
    Generate timed captions for a given audio file in Japanese.
    """
    WHISPER_MODEL = load_model(model_size)
   
    # Perform transcription
    gen = transcribe_timestamped(WHISPER_MODEL, audio_filename, verbose=False, fp16=False)
    
    # Check if transcription contains 'text'
    if 'text' not in gen:
        raise ValueError("No transcription text found. Check the audio file or Whisper model.")
   
    return getCaptionsWithTime(gen)

def splitWordsBySize(words, maxCaptionSize):
    """
    Split words into captions that do not exceed the specified max size.
    """
    halfCaptionSize = maxCaptionSize / 2
    captions = []
    
    while words:
        caption = words[0]
        words = words[1:]
        while words and len(caption + ' ' + words[0]) <= maxCaptionSize:
            caption += ' ' + words[0]
            words = words[1:]
            if len(caption) >= halfCaptionSize and words:
                break
        captions.append(caption)
    
    return captions

def cleanText(text):
    """
    Remove unnecessary symbols while keeping Japanese characters intact.
    Keep punctuation marks common in Japanese.
    """
    return re.sub(r'[^\p{Han}\p{Hiragana}\p{Katakana}、。！？「」]', '', text)

def getTimestampMapping(whisper_analysis):
    """
    Map text positions to timestamps from Whisper's analysis.
    """
    index = 0
    locationToTimestamp = {}
    
    if 'segments' not in whisper_analysis:
        raise ValueError("No segments found in the Whisper transcription.")
    
    for segment in whisper_analysis['segments']:
        if 'words' not in segment:
            continue
        for word in segment['words']:
            newIndex = index + len(word['text'])
            locationToTimestamp[(index, newIndex)] = word['end']
            index = newIndex
    
    return locationToTimestamp

def interpolateTimeFromDict(word_position, d):
    """
    Interpolate the timestamp for a given word position based on the location-to-timestamp mapping.
    """
    for key, value in d.items():
        if key[0] <= word_position <= key[1]:
            return value
    return None

def getCaptionsWithTime(whisper_analysis, maxCaptionSize=15, considerPunctuation=False):
    """
    Generate captions with time stamps based on the Whisper analysis.
    """
    wordLocationToTime = getTimestampMapping(whisper_analysis)
    position = 0
    start_time = 0
    CaptionsPairs = []
    text = whisper_analysis['text']
    
    # If punctuation is considered, split sentences
    if considerPunctuation:
        sentences = re.split(r'(?<=[。！？]) +', text)  # Japanese punctuation handling
        words = [word for sentence in sentences for word in splitWordsBySize(sentence.split(), maxCaptionSize)]
    else:
        # Clean the text for Japanese characters and split it
        text = cleanText(text)
        words = text.split()
        words = [cleanText(word) for word in splitWordsBySize(words, maxCaptionSize)]
    
    for word in words:
        position += len(word) + 1
        end_time = interpolateTimeFromDict(position, wordLocationToTime)
        
        if end_time and word:
            CaptionsPairs.append(((start_time, end_time), word))
            start_time = end_time

    return CaptionsPairs
