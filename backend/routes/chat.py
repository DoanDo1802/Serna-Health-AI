"""
Chat routes for AI conversation
"""
from flask import Blueprint, request, Response
from services.ai_service import handle_chat_stream
from utils.response_utils import error_response

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat conversation with AI"""
    try:
        data = request.get_json()

        if not data or 'message' not in data:
            return error_response("No message provided", 400)

        message = data['message']
        conversation_history = data.get('conversation_history', [])
        patient_info = data.get('patient_info', None)
        diagnosis_result = data.get('diagnosis_result', None)

        # Stream AI response
        return Response(
            handle_chat_stream(message, conversation_history, patient_info, diagnosis_result),
            mimetype='text/plain'
        )

    except Exception as e:
        return error_response(f"Error in chat: {str(e)}", 500)
