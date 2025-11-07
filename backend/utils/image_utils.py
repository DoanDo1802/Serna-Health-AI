"""
Image processing utilities
"""
import numpy as np
from PIL import Image
import base64
import io

def validate_image(image_file):
    """Validate uploaded image file"""
    try:
        img = Image.open(image_file.stream)
        # Reset stream position
        image_file.stream.seek(0)
        return True, img
    except Exception as e:
        return False, str(e)

def resize_image(image, size=(256, 256)):
    """Resize image to specified size"""
    return image.resize(size)

def convert_to_grayscale(image):
    """Convert image to grayscale"""
    if image.mode != 'L':
        return image.convert('L')
    return image

def convert_to_rgb(image):
    """Convert image to RGB"""
    if image.mode != 'RGB':
        return image.convert('RGB')
    return image

def normalize_image_array(img_array):
    """Normalize image array to 0-1 range"""
    return img_array.astype(np.float32) / 255.0

def image_to_base64(image, format='PNG'):
    """Convert PIL Image to base64 string"""
    try:
        buffer = io.BytesIO()
        image.save(buffer, format=format)
        img_b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/{format.lower()};base64,{img_b64}"
    except Exception as e:
        print(f"Error converting image to base64: {str(e)}")
        return None

def base64_to_image(base64_string):
    """Convert base64 string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        img_data = base64.b64decode(base64_string)
        img = Image.open(io.BytesIO(img_data))
        return img
    except Exception as e:
        print(f"Error converting base64 to image: {str(e)}")
        return None
