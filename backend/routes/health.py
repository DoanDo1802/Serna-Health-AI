"""
Health check routes
"""
from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Medical AI API is running'
    })

@health_bp.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Medical AI API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'lung_cancer_prediction': '/api/predict/lung-cancer',
            'tumor_detection': '/api/predict/tumor',
            'cancer_stage': '/api/predict/cancer-stage',
            'chat': '/api/chat',
            'recommendations': '/api/recommendations'
        }
    })
