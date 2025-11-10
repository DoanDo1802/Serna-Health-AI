"""
Recommendations service using Gemini AI
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

def get_fallback_recommendations(lung_cancer_label, tumor_detected,
                               cancer_stage, patient_info, overlay_image=None):
    """Generate medical recommendations using Gemini AI"""

    # Extract patient information
    age = patient_info.get('age', 'Không rõ')
    gender = patient_info.get('gender', 'Không rõ')
    health_factors = patient_info.get('health_factors', {})

    # Extract cancer stage information
    cancer_stage_class = cancer_stage.get('predicted_class', 'Unknown') if cancer_stage else 'Unknown'

    # Format gender
    gender_text = "Nam" if gender == 1 else "Nữ" if gender == 0 else "Không rõ"

    # Format ALL health factors
    all_factors = []
    if health_factors:
        for factor, value in health_factors.items():
            if isinstance(value, (int, float)):
                factor_name = factor.replace('_', ' ').title()
                all_factors.append(f"{factor_name}: {value}/8")

    try:
        # Try to generate AI recommendations
        full_response = generate_ai_recommendations(
            age, gender_text, all_factors,
            lung_cancer_label, tumor_detected,
            cancer_stage_class, overlay_image
        )

        # Extract recommendations from response
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
        print(f"AI recommendation error: {str(e)}")
        # Fallback to basic template if AI fails
        return generate_basic_fallback(
            age, gender_text, all_factors,
            lung_cancer_label, tumor_detected,
            cancer_stage_class
        )

def generate_ai_recommendations(age, gender_text, all_factors,
                              lung_cancer_label, tumor_detected,
                              cancer_stage_class, overlay_image=None):
    """Generate recommendations using Gemini AI with full patient information and overlay image"""

    if not configure_gemini():
        raise Exception("Gemini API key not configured")

    # Format factors for display
    factors_text = "\n".join([f"• {f}" for f in all_factors]) if all_factors else "• Không có yếu tố nguy cơ cao"

    # Build system prompt
    # Prepare assessment instruction based on whether we have overlay image
    if overlay_image and tumor_detected:
        assessment_instruction = """Phân tích CHI TIẾT hình ảnh CT scan được tô vùng:
            - Mô tả vị trí chính xác của vùng bất thường
            - Kích thước ước tính của tổn thương
            - Đặc điểm hình ảnh (mật độ, ranh giới, hình dạng)
            - Mối liên hệ với các cấu trúc giải phẫu xung quanh
            - Đánh giá mức độ nguy hiểm dựa trên hình ảnh
            - Kết hợp với thông tin bệnh nhân và yếu tố nguy cơ để đưa ra nhận định lâm sàng toàn diện"""
    else:
        assessment_instruction = "Phân tích tổng hợp tình trạng bệnh nhân dựa trên thông tin lâm sàng và yếu tố nguy cơ"

    if overlay_image and tumor_detected:
        image_section = ("HÌNH ẢNH CT SCAN:\n"
                         "Hình ảnh CT scan đã được AI tô vùng bất thường (vùng được khoanh vùng là vùng bất thường được phát hiện). "
                         "Hãy phân tích chi tiết hình ảnh này và đưa ra đánh giá vị trí, kích thước, đặc điểm của tổn thương.\n")
    else:
        image_section = ""

    image_mention = "và phân tích hình ảnh CT scan" if overlay_image and tumor_detected else ""

    system_prompt = f"""Bạn là bác sĩ chuyên khoa ung bướu chuyên về ung thư phổi, có hơn 15 năm kinh nghiệm lâm sàng.

            THÔNG TIN BỆNH NHÂN:
            • Tuổi: {age}
            • Giới tính: {gender_text}
            • Yếu tố nguy cơ:
            {factors_text}

            KẾT QUẢ PHÂN TÍCH AI:
            • Mô hình đánh giá nguy cơ ung thư phổi: {lung_cancer_label}
            • Phát hiện vùng bất thường trên CT scan: {"Có" if tumor_detected else "Không"}
            • Phân loại tổn thương: {cancer_stage_class if cancer_stage_class != 'Unknown' else 'Chưa phân loại'}

            {image_section}
            YÊU CẦU:
            Dựa trên thông tin bệnh nhân, kết quả phân tích AI{image_mention}, hãy đưa ra khuyến nghị y khoa với ĐÚNG 3 mục sau (KHÔNG có lời chào, giới thiệu hay bất kỳ nội dung nào khác):

            **NHẬN ĐỊNH LÂM SÀNG:**
            {assessment_instruction}

            **KHUYẾN NGHỊ Y KHOA:**
            [Danh sách khuyến nghị cụ thể với thời gian và phương pháp rõ ràng]

            **LƯU Ý QUAN TRỌNG:**
            [Các lưu ý đặc biệt cho bệnh nhân]

            QUAN TRỌNG: Trả lời TRỰC TIẾP với 3 mục trên, không cần lời chào, giới thiệu hay bất kỳ nội dung nào khác. Hãy chuyên nghiệp, cụ thể và có giá trị thực hành."""

    try:
        model = genai.GenerativeModel(Config.GEMINI_MODEL)

        # Prepare content parts
        content_parts = [system_prompt]

        # Add overlay image if available
        if overlay_image and tumor_detected:
            try:
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
                content_parts.append("\n\nHãy phân tích chi tiết hình ảnh CT scan được tô vùng này. Mô tả vị trí, kích thước, đặc điểm của vùng bất thường được phát hiện để có thêm tính khách quan trong khuyến nghị.")
            except Exception as img_error:
                print(f"Warning: Could not process overlay image: {str(img_error)}")

        response = model.generate_content(content_parts)

        if response.text:
            return response.text
        else:
            raise Exception("Empty response from Gemini API")

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
            elif 'LƯU Ý' in line.upper():
                if in_recommendations_section:
                    break
            elif in_recommendations_section and line:
                if line.startswith(('1.', '2.', '3.', '4.', '5.', '-', '•', '*')):
                    recommendations.append(line)
                    if len(recommendations) >= 5:
                        break

        return recommendations if recommendations else ["Tham khảo ý kiến bác sĩ chuyên khoa"]
    except Exception as e:
        print(f"Error extracting recommendations: {str(e)}")
        return ["Tham khảo ý kiến bác sĩ chuyên khoa"]

def generate_basic_fallback(age, gender_text, all_factors,
                           lung_cancer_label, tumor_detected,
                           cancer_stage_class):
    """Generate basic fallback recommendations when AI is unavailable"""

    # Format factors for display
    factors_text = "\n".join([f"• {f}" for f in all_factors]) if all_factors else "• Không có yếu tố nguy cơ cao"

    # Basic fallback response with 3 main sections
    fallback_response = f"""**NHẬN ĐỊNH LÂM SÀNG:**
        Bệnh nhân {gender_text}, {age} tuổi, được đánh giá nguy cơ ung thư phổi ở mức {lung_cancer_label.lower()}.
        {"Phát hiện vùng bất thường trên CT scan cần đánh giá chi tiết bởi bác sĩ chuyên khoa." if tumor_detected else "Hình ảnh CT scan không phát hiện vùng bất thường rõ ràng."}
        Phân loại tổn thương: {cancer_stage_class if cancer_stage_class != 'Unknown' else 'Chưa phân loại'}.
        Cần kết hợp thông tin lâm sàng, yếu tố nguy cơ và kết quả AI để đưa ra quyết định lâm sàng.

        **KHUYẾN NGHỊ Y KHOA:**
        1. Tham khảo ý kiến bác sĩ chuyên khoa hô hấp/ung bướu
        2. Thực hiện các xét nghiệm bổ sung theo chỉ định
        3. Kiểm soát các yếu tố nguy cơ
        4. Theo dõi triệu chứng hô hấp
        5. Khám sức khỏe định kỳ

        **LƯU Ý QUAN TRỌNG:**
        • Kết quả này chỉ mang tính chất tham khảo, không thay thế cho ý kiến của bác sĩ chuyên khoa
        • Cần tuân thủ đúng lịch tái khám và theo dõi định kỳ
        • Liên hệ ngay với bác sĩ nếu có bất kỳ triệu chứng bất thường nào"""

    return {
        'full_response': fallback_response,
        'recommendations': [
            "Tham khảo ý kiến bác sĩ chuyên khoa",
            "Thực hiện các xét nghiệm bổ sung",
            "Kiểm soát các yếu tố nguy cơ",
            "Theo dõi triệu chứng hô hấp",
            "Khám sức khỏe định kỳ"
        ],
        'diagnosis_summary': {
            'lung_cancer_label': lung_cancer_label,
            'tumor_detected': tumor_detected
        }
    }
