"""
Response utilities for API endpoints
"""
from flask import jsonify

def error_response(message, status_code=500):
    """Create standardized error response"""
    return jsonify({
        'error': message,
        'status_code': status_code
    }), status_code

def success_response(data, message="Success"):
    """Create standardized success response"""
    return jsonify({
        'data': data,
        'message': message,
        'status': 'success'
    })

def validation_error(errors):
    """Create validation error response"""
    return jsonify({
        'error': 'Validation failed',
        'errors': errors,
        'status_code': 400
    }), 400
