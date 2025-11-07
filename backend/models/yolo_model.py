"""
YOLO model operations for cancer stage classification
"""
from PIL import Image
from models.model_loader import get_yolo_model
from config import Config

def predict_cancer_stage(image):
    """Predict cancer stage using YOLO classification model"""
    try:
        model = get_yolo_model()
        
        # Ensure image is in RGB format for YOLO
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Run YOLO classification
        results = model(image, verbose=False)
        result = results[0]
        
        # Get top prediction
        top_class_idx = result.probs.top1
        confidence = float(result.probs.top1conf)
        predicted_class = Config.CANCER_STAGE_CLASSES[top_class_idx]
        
        # Get all class probabilities
        all_probs = {}
        for i, prob in enumerate(result.probs.data):
            all_probs[Config.CANCER_STAGE_CLASSES[i]] = float(prob)
        
        # Create boolean flags
        is_malignant = predicted_class == 'Malignant'
        is_benign = predicted_class == 'Benign'
        is_normal = predicted_class == 'Normal'
        
        return {
            'predicted_class': predicted_class,
            'confidence': confidence,
            'class_probabilities': all_probs,
            'is_malignant': is_malignant,
            'is_benign': is_benign,
            'is_normal': is_normal
        }
        
    except Exception as e:
        raise Exception(f"Error in cancer stage prediction: {str(e)}")
