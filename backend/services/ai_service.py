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
        system_prompt = """
        Bạn là **Trợ lý AI Y tế chuyên về Ung thư Phổi**.

        **CÁCH TRẢ LỜI:**
        - **Cụ thể**: Trả lời trực tiếp câu hỏi, không nói chung chung
        - **Ngắn gọn**: 2-3 câu chính, tránh dài dòng
        - **Thân thiện**: Dễ hiểu, tránh thuật ngữ phức tạp
        - **Tập trung**: Chỉ nói về vấn đề người dùng hỏi

        **NGUYÊN TẮC:**
        1. Trả lời câu hỏi trước tiên
        2. Nếu cần, thêm 1-2 lời khuyên liên quan
        3. Luôn khuyến khích tham khảo bác sĩ
        4. Không chẩn đoán, không kê đơn

        Hãy trả lời ngắn gọn, cụ thể và thân thiện.
        """

        # Add patient info context if available
        if patient_info:
            age = patient_info.get('age', 'Không rõ')
            gender = "Nam" if patient_info.get('gender') == 1 else "Nữ" if patient_info.get('gender') == 0 else "Không rõ"
            health_factors = patient_info.get('health_factors', {})

            # Format high-risk factors
            high_risk = []
            if health_factors:
                for factor, value in health_factors.items():
                    if isinstance(value, (int, float)) and value >= 6:
                        factor_name = factor.replace('_', ' ').title()
                        high_risk.append(f"{factor_name}: {value}/8")

            high_risk_text = f"- Yếu tố nguy cơ cao: {', '.join(high_risk[:3])}" if high_risk else "- Yếu tố nguy cơ: Bình thường"

            system_prompt += f"""

        **THÔNG TIN BỆNH NHÂN (Health Mode):**
        - Tuổi: {age}
        - Giới tính: {gender}
        {high_risk_text}

        Hãy xem xét thông tin bệnh nhân này khi trả lời câu hỏi.
        """

        # Add diagnosis result context if available
        if diagnosis_result:
            clinical_assessment = diagnosis_result.get('clinical_assessment', '')
            xgboost_result = diagnosis_result.get('xgboost_result', {})
            tumor_result = diagnosis_result.get('tumor_result', {})
            cancer_stage = diagnosis_result.get('cancer_stage', {})

            diagnosis_info = "**KẾT QUẢ CHẨN ĐOÁN:**\n"

            # Add XGBoost result (without confidence)
            if xgboost_result:
                diagnosis_info += f"- Mức độ nguy cơ: {xgboost_result.get('risk_level', 'Không rõ')}\n"

            # Add tumor result (without confidence)
            if tumor_result:
                diagnosis_info += f"- Phát hiện u: {'Có' if tumor_result.get('has_tumor') else 'Không'}\n"

            # Add cancer stage result only if confidence >= 20% (without confidence)
            if cancer_stage and cancer_stage.get('confidence', 0) >= 0.2:
                diagnosis_info += f"- Phân loại: {cancer_stage.get('stage', 'Không rõ')}\n"

            system_prompt += f"""

        {diagnosis_info}
        **NHẬN ĐỊNH LÂM SÀNG:**
        {clinical_assessment}

        Hãy sử dụng thông tin chẩn đoán này để cung cấp lời khuyên y tế phù hợp.
        """

        # Build conversation context
        contents = []

        # Add system prompt as first message
        contents.append({
            "role": "user",
            "parts": [{"text": system_prompt}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "Tôi hiểu vai trò của mình. Tôi là Trợ lý AI Y tế chuyên về Ung thư Phổi, sẵn sàng hỗ trợ bạn với các câu hỏi về sức khỏe phổi và ung thư phổi. Tôi sẽ cung cấp thông tin chính xác, an toàn và luôn khuyến khích bạn tham khảo ý kiến bác sĩ chuyên khoa khi cần thiết."}]
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

def generate_medical_recommendations(lung_cancer_label, tumor_detected,
                                   cancer_stage, patient_info, overlay_image):
    """Generate medical recommendations using Gemini AI"""
    if not configure_gemini():
        raise Exception("Gemini API key not configured")
    
    # Extract patient information
    age = patient_info.get('age', 'Không rõ')
    gender = patient_info.get('gender', 'Không rõ')
    health_factors = patient_info.get('health_factors', {})
    
    # Extract cancer stage information
    cancer_stage_class = cancer_stage.get('predicted_class', 'Unknown') if cancer_stage else 'Unknown'
    cancer_stage_confidence = cancer_stage.get('confidence', 0) if cancer_stage else 0
    
    # Format gender
    gender_text = "Nam" if gender == 1 else "Nữ" if gender == 0 else "Không rõ"
    
    # Format key health factors
    key_factors = []
    if health_factors:
        high_risk_factors = []
        for factor, value in health_factors.items():
            if isinstance(value, (int, float)) and value >= 6:
                factor_name = factor.replace('_', ' ').title()
                high_risk_factors.append(f"{factor_name}: {value}/8")
        if high_risk_factors:
            key_factors = high_risk_factors[:5]
    
    # Create system prompt
    system_prompt = f"""
        Bạn là **bác sĩ chuyên khoa ung bướu – chuyên về ung thư phổi**, có hơn 15 năm kinh nghiệm lâm sàng trong chẩn đoán và điều trị các bệnh lý hô hấp ác tính.
        Phân tích TỔNG HỢP tất cả thông tin để đưa ra nhận định và chỉ định y tế có giá trị thực hành.

        THÔNG TIN BỆNH NHÂN:
        • Tuổi: {age}
        • Giới tính: {gender_text}
        {f"• Yếu tố nguy cơ cao: {', '.join(key_factors)}" if key_factors else "• Yếu tố nguy cơ: Trong giới hạn bình thường"}

        KẾT QUẢ PHÂN TÍCH AI CHUYÊN NGHIỆP:
        • **Mô hình đánh giá nguy cơ ung thư phổi**: {lung_cancer_label}
        • **Phân tích hình ảnh CT scan**: {"Có phát hiện vùng bất thường" if tumor_detected else "Không phát hiện vùng bất thường"}
        • **Phân loại tổn thương**: {cancer_stage_class if cancer_stage_class != 'Unknown' else 'Chưa phân loại'}
        {"• **Hình ảnh CT scan**: Đã được AI phát hiện và tô vùng bất thường - Hãy phân tích hình ảnh theo chuyên ngành y tế và đưa ra nhận xét chuyên nghiệp về vị trí, kích thước, đặc điểm của vùng bất thường" if overlay_image and tumor_detected else "• **Hình ảnh CT scan**: Không phát hiện vùng bất thường rõ ràng"}

        NGUYÊN TẮC LÂM SÀNG:
        - Kết hợp thông tin bệnh nhân, yếu tố nguy cơ, kết quả AI và hình ảnh để đưa ra quyết định lâm sàng.
        - Đưa ra khuyến nghị có **giá trị sử dụng thực tế**, rõ **thời gian – tần suất – phương pháp**.
        - Mỗi khuyến nghị phải **có mục tiêu y khoa rõ ràng**: chẩn đoán xác định, theo dõi, hoặc can thiệp sớm.
        - Ngôn ngữ phải thể hiện phong cách của **một bác sĩ đang ra chỉ định cho bệnh nhân**, không chung chung hay mơ hồ.

        YÊU CẦU ĐỊNH DẠNG:
        **NHẬN ĐỊNH LÂM SÀNG:**
        [Phân tích tổng hợp tình trạng bệnh nhân dựa trên tất cả thông tin]

        **KHUYẾN NGHỊ Y KHOA:**
        [Danh sách khuyến nghị cụ thể với thời gian và phương pháp rõ ràng]

        **LƯU Ý QUAN TRỌNG:**
        [Các lưu ý đặc biệt cho bệnh nhân]
    """
    
    try:
        model = genai.GenerativeModel(Config.GEMINI_MODEL)

        # Prepare content with image if available
        content_parts = [system_prompt]

        # Add overlay image to the prompt if available
        if overlay_image and tumor_detected:
            try:
                # Convert base64 image to image data for Gemini
                import base64
                from PIL import Image
                import io

                # Extract base64 data from data URL
                if overlay_image.startswith('data:image'):
                    # Format: data:image/png;base64,<base64_data>
                    base64_data = overlay_image.split(',')[1]
                else:
                    base64_data = overlay_image

                # Decode base64 to bytes
                image_bytes = base64.b64decode(base64_data)

                # Add image to content
                content_parts.append({
                    'mime_type': 'image/png',
                    'data': image_bytes
                })

                # Add instruction to analyze the image
                content_parts.append("\n\nHãy phân tích chi tiết hình ảnh CT scan được khoanh vùng này. Mô tả vị trí, kích thước, đặc điểm của vùng bất thường được phát hiện.")
            except Exception as img_error:
                print(f"Warning: Could not process overlay image: {str(img_error)}")

        response = model.generate_content(content_parts)

        full_response = response.text
        
        # Extract recommendations from full response
        recommendations = extract_recommendations_from_response(full_response)
        
        return {
            'full_response': full_response,
            'recommendations': recommendations,
            'diagnosis_summary': {
                'lung_cancer_label': lung_cancer_label,
                'tumor_detected': tumor_detected
            }
        }
        
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

def extract_recommendations_from_response(response_text):
    """Extract key recommendations from AI response"""
    try:
        lines = response_text.split('\n')
        recommendations = []
        
        in_recommendations_section = False
        for line in lines:
            line = line.strip()
            if 'KHUYẾN NGHỊ' in line.upper():
                in_recommendations_section = True
                continue
            elif 'LƯU Ý' in line.upper() or 'NHẬN ĐỊNH' in line.upper():
                if in_recommendations_section:
                    break
            elif in_recommendations_section and line:
                if line.startswith(('1.', '2.', '3.', '4.', '5.', '-', '•', '*')):
                    recommendations.append(line)
                    if len(recommendations) >= Config.MAX_RECOMMENDATIONS:
                        break
        
        return recommendations[:Config.MAX_RECOMMENDATIONS]
        
    except Exception:
        return ["Vui lòng tham khảo ý kiến bác sĩ chuyên khoa để được tư vấn chi tiết."]
