"""
Prediction routes for AI models
"""
from flask import Blueprint, request, jsonify
from PIL import Image
from models.xgboost_model import predict_lung_cancer_risk
from models.unet_model import predict_tumor_segmentation
from models.yolo_model import predict_cancer_stage
from utils.response_utils import error_response

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/api/predict/lung-cancer', methods=['POST'])
def predict_lung_cancer():
    """Predict lung cancer risk using patient data"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response("No data provided", 400)
        
        # Predict lung cancer risk
        result = predict_lung_cancer_risk(data)
        
        return jsonify(result)
        
    except Exception as e:
        return error_response(f"Error in lung cancer prediction: {str(e)}", 500)

@prediction_bp.route('/api/predict/tumor', methods=['POST'])
def predict_tumor():
    """Predict tumor segmentation using CT scan image"""
    try:
        if 'image' not in request.files:
            return error_response("No image provided", 400)
        
        image_file = request.files['image']
        threshold = float(request.form.get('threshold', 0.5))
        
        # Load and process image
        img = Image.open(image_file.stream)
        
        # Predict tumor segmentation
        result = predict_tumor_segmentation(img, threshold)
        
        return jsonify(result)
        
    except Exception as e:
        return error_response(f"Error in tumor prediction: {str(e)}", 500)

@prediction_bp.route('/api/predict/cancer-stage', methods=['POST'])
def predict_cancer_stage_route():
    """Predict cancer stage classification using CT scan image"""
    try:
        if 'image' not in request.files:
            return error_response("No image provided", 400)
        
        image_file = request.files['image']
        
        # Load and process image
        img = Image.open(image_file.stream)
        
        # Predict cancer stage
        result = predict_cancer_stage(img)
        
        return jsonify(result)
        
    except Exception as e:
        return error_response(f"Error in cancer stage prediction: {str(e)}", 500)
