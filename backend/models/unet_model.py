"""
U-Net model operations for tumor segmentation
"""
import numpy as np
from PIL import Image
import base64
import io
from models.model_loader import get_unet_model
from config import Config

def preprocess_image_for_unet(image):
    """Preprocess image for U-Net model"""
    # Convert to grayscale and resize
    if image.mode != 'L':
        image = image.convert('L')
    
    image = image.resize(Config.IMAGE_SIZE)
    
    # Convert to numpy array and normalize
    img_array = np.array(image, dtype=np.float32) / 255.0
    
    # Add batch and channel dimensions
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension
    
    return img_array

def predict_tumor_segmentation(image, threshold=0.5):
    """Predict tumor segmentation using U-Net model"""
    try:
        model = get_unet_model()
        
        # Preprocess image
        processed_image = preprocess_image_for_unet(image)
        
        # Make prediction
        prediction = model.predict(processed_image, verbose=0)
        
        # Apply threshold
        binary_mask = (prediction[0, :, :, 0] > threshold).astype(np.uint8)
        
        # Calculate tumor area and confidence
        tumor_area = np.sum(binary_mask)
        total_area = binary_mask.shape[0] * binary_mask.shape[1]
        tumor_percentage = (tumor_area / total_area) * 100
        
        has_tumor = tumor_area > 0
        confidence = np.max(prediction[0, :, :, 0]) * 100 if has_tumor else (1 - np.max(prediction[0, :, :, 0])) * 100
        
        # Convert mask to base64 image
        mask_image_b64 = None
        if has_tumor:
            mask_image_b64 = mask_to_base64(binary_mask)
        
        return {
            'has_tumor': bool(has_tumor),
            'tumor_area': float(tumor_percentage),
            'confidence': float(confidence),
            'mask_image': mask_image_b64
        }
        
    except Exception as e:
        raise Exception(f"Error in tumor prediction: {str(e)}")

def mask_to_base64(mask):
    """Convert binary mask to base64 encoded image"""
    try:
        # Convert binary mask to PIL Image
        mask_img = Image.fromarray((mask * 255).astype(np.uint8), mode='L')
        
        # Convert to base64
        buffer = io.BytesIO()
        mask_img.save(buffer, format='PNG')
        mask_b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{mask_b64}"
        
    except Exception as e:
        print(f"Error converting mask to base64: {str(e)}")
        return None
