import subprocess
import json
import os
import logging

logger = logging.getLogger(__name__)

def probe_media(file_path: str) -> dict:
    """
    Run ffprobe on the file to extract metadata like width, height, duration, and FPS.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # For images, we can check basic image type or handle gracefully
    # If the file has a video stream, it's treated as video, otherwise image
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_format",
        "-show_streams",
        "-of", "json"
    ]
    
    try:
        result = subprocess.run(cmd + [file_path], capture_output=True, text=True, check=True)
        metadata = json.loads(result.stdout)
        
        format_info = metadata.get("format", {})
        streams = metadata.get("streams", [])
        
        video_stream = next((s for s in streams if s.get("codec_type") == "video"), None)
        audio_stream = next((s for s in streams if s.get("codec_type") == "audio"), None)
        
        info = {
            "type": "video" if video_stream else "image",
            "duration_ms": None,
            "width": None,
            "height": None,
            "fps": None,
            "has_audio": audio_stream is not None,
            "mime_type": None
        }

        # Size in bytes
        size_bytes = int(format_info.get("size", os.path.getsize(file_path)))
        info["size_bytes"] = size_bytes

        # Extract duration
        duration_sec = format_info.get("duration")
        if not duration_sec and video_stream:
            duration_sec = video_stream.get("duration")
        if duration_sec:
            info["duration_ms"] = int(float(duration_sec) * 1000)

        # Extract dimensions
        if video_stream:
            info["width"] = int(video_stream.get("width", 0))
            info["height"] = int(video_stream.get("height", 0))
            
            # FPS
            r_frame_rate = video_stream.get("r_frame_rate", "0/0")
            if "/" in r_frame_rate:
                try:
                    num, den = map(int, r_frame_rate.split("/"))
                    if den > 0:
                        info["fps"] = round(num / den, 2)
                except Exception:
                    pass
        elif len(streams) > 0:
            # Maybe an image format
            info["width"] = int(streams[0].get("width", 0))
            info["height"] = int(streams[0].get("height", 0))
            info["type"] = "image"
            
        return info
    except Exception as e:
        logger.error(f"Error probing media {file_path}: {e}")
        # Return fallback basics
        return {
            "type": "image" if file_path.lower().endswith((".png", ".jpg", ".jpeg", ".webp")) else "video",
            "duration_ms": 0,
            "width": 1080,
            "height": 1920,
            "fps": 30.0,
            "has_audio": False,
            "size_bytes": os.path.getsize(file_path) if os.path.exists(file_path) else 0
        }

def extract_audio(video_path: str, output_audio_path: str) -> bool:
    """
    Extract the audio track from a video and save it as mono 16kHz WAV for easy transcription.
    """
    if not os.path.exists(video_path):
        logger.error(f"Video path does not exist: {video_path}")
        return False
        
    cmd = [
        "ffmpeg",
        "-y",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        output_audio_path
    ]
    
    try:
        subprocess.run(cmd, capture_output=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg audio extraction failed: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"Error executing FFmpeg: {e}")
        return False

def extract_frame(video_path: str, timestamp_sec: float, output_image_path: str) -> bool:
    """
    Extract a single frame from the video at the given timestamp (seconds) and save as JPEG.
    """
    if not os.path.exists(video_path):
        return False
        
    cmd = [
        "ffmpeg",
        "-y",
        "-ss", str(timestamp_sec),
        "-i", video_path,
        "-vframes", "1",
        "-q:v", "4",
        output_image_path
    ]
    
    try:
        subprocess.run(cmd, capture_output=True, check=True)
        return True
    except Exception as e:
        logger.error(f"Error extracting frame at {timestamp_sec}s: {e}")
        return False
