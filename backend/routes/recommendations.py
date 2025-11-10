"""
Recommendations routes for medical advice
"""
from flask import Blueprint, request, jsonify
from services.fallback_service import get_fallback_recommendations
from utils.response_utils import error_response

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get medical recommendations based on diagnosis results"""
    try:
        data = request.get_json()

        if not data:
            return error_response("No data provided", 400)

        # Extract diagnosis results
        lung_cancer_label = data.get('lung_cancer_label', 'Low')
        tumor_detected = data.get('tumor_detected', False)

        # Extract cancer stage classification results
        cancer_stage = data.get('cancer_stage', {})

        # Extract patient information
        patient_info = data.get('patient_info', {})

        # Extract overlay image
        overlay_image = data.get('overlay_image', None)

        # Generate recommendations using fallback service
        result = get_fallback_recommendations(
            lung_cancer_label=lung_cancer_label,
            tumor_detected=tumor_detected,
            cancer_stage=cancer_stage,
            patient_info=patient_info,
            overlay_image=overlay_image
        )

        return jsonify(result)

    except Exception as e:
        return error_response(f"Error generating recommendations: {str(e)}", 500)
