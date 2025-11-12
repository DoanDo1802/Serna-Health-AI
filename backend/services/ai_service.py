"""
AI service for Gemini API interactions
"""
import json
import google.generativeai as genai
from config import Config

def configure_gemini():
    """Configure Gemini AI"""
    if Config.GEMINI_API_KEY:
        genai.configure(api_key=Config.GEMINI_API_KEY)
        return True
    return False

def handle_chat_stream(message, conversation_history, patient_info=None, diagnosis_result=None):
    """Handle streaming chat with Gemini AI"""
    if not configure_gemini():
        yield "data: {\"text\": \"Gemini API key not configured\"}\n\n"
        return

    try:
        model = genai.GenerativeModel(Config.GEMINI_MODEL)

        # Build system prompt
        system_prompt = "Bạn là Serna AI Trợ lý AI Y tế chuyên về Ung thư Phổi. Trả lời ngắn gọn, cụ thể, thân thiện. Luôn khuyến khích tham khảo bác sĩ."

        # Add patient info context if available
        if patient_info:
            age = patient_info.get('age', 'Không rõ')
            gender = "Nam" if patient_info.get('gender') == 1 else "Nữ" if patient_info.get('gender') == 0 else "Không rõ"
            health_factors = patient_info.get('health_factors', {})

            # Format ALL health factors (not just high-risk)
            factors_list = []
            if health_factors:
                for factor, value in health_factors.items():
                    if isinstance(value, (int, float)):
                        # Use abbreviations to reduce token count
                        factor_short = ''.join([w[0] for w in factor.split('_')])
                        factors_list.append(f"{factor_short}:{value}")

            factors_text = f"Yếu tố: {', '.join(factors_list)}" if factors_list else "Yếu tố: Không có"

            system_prompt += f"\n[BN] Tuổi:{age}, GT:{gender}. {factors_text}"

        # Add diagnosis result context if available
        if diagnosis_result:
            full_response = diagnosis_result.get('full_response', '')
            xgboost_result = diagnosis_result.get('xgboost_result', {})
            tumor_result = diagnosis_result.get('tumor_result', {})
            cancer_stage = diagnosis_result.get('cancer_stage', {})

            # Add model results
            model_results = []
            if xgboost_result:
                risk_level = xgboost_result.get('risk_level', '?')
                model_results.append(f"XGB:{risk_level}")

            if tumor_result:
                has_tumor = tumor_result.get('has_tumor', False)
                model_results.append(f"U:{'Có' if has_tumor else 'Không'}")

            if cancer_stage:
                stage = cancer_stage.get('stage', '?')
                model_results.append(f"Stage:{stage}")

            if model_results:
                system_prompt += f"\n[KQ] {' | '.join(model_results)}"

            # Add full clinical assessment from recommendations if available
            if full_response:
                # full_response contains NHẬN ĐỊNH LÂM SÀNG with all diagnosis info
                # Expand to first 1000 chars to keep more key info
                assessment_short = full_response[:1000] if len(full_response) > 1000 else full_response
                system_prompt += f"\n[ASSESS] {assessment_short}"

        # Build conversation context
        contents = []

        # Add system prompt as first message
        contents.append({
            "role": "user",
            "parts": [{"text": system_prompt}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "Tôi hiểu vai trò của mình. Tôi là Serna AI Trợ lý AI Y tế chuyên về Ung thư Phổi, sẵn sàng hỗ trợ bạn với các câu hỏi về sức khỏe phổi và ung thư phổi. Tôi sẽ cung cấp thông tin chính xác, an toàn và luôn khuyến khích bạn tham khảo ý kiến bác sĩ chuyên khoa khi cần thiết."}]
        })

        # Add conversation history
        for msg in conversation_history:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({
                "role": role,
                "parts": [{"text": msg.get("content", "")}]
            })

        # Add current message
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })
        
        # Generate response (non-streaming for compatibility)
        response = model.generate_content(contents)
        if response.text:
            yield f"data: {json.dumps({'text': response.text})}\n\n"

        # Send completion signal
        yield f"data: {json.dumps({'done': True})}\n\n"
                
    except Exception as e:
        yield f"data: {json.dumps({'text': f'Error: {str(e)}'})}\n\n"


