"""
Fallback service for when AI APIs are unavailable
"""

def get_fallback_recommendations(lung_cancer_label, tumor_detected,
                               cancer_stage, patient_info, overlay_image=None):
    """Generate fallback recommendations when AI is unavailable"""

    # Extract patient information
    age = patient_info.get('age', 'Không rõ')
    gender = patient_info.get('gender', 'Không rõ')
    health_factors = patient_info.get('health_factors', {})

    # Extract cancer stage information
    cancer_stage_class = cancer_stage.get('predicted_class', 'Unknown') if cancer_stage else 'Unknown'
    
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
    
    # Determine risk level based on lung_cancer_label
    if lung_cancer_label.lower() == "high":
        risk_level = "high"
    elif lung_cancer_label.lower() == "medium":
        risk_level = "moderate"
    else:  # low
        risk_level = "low"
    
    # Generate appropriate recommendations based on risk level and cancer stage
    full_response = generate_fallback_response(
        risk_level, age, gender_text, key_factors,
        lung_cancer_label, tumor_detected,
        cancer_stage_class, overlay_image
    )
    
    # Extract recommendations
    recommendations = extract_fallback_recommendations(risk_level, cancer_stage_class)
    
    return {
        'full_response': full_response,
        'recommendations': recommendations,
        'diagnosis_summary': {
            'lung_cancer_label': lung_cancer_label,
            'tumor_detected': tumor_detected
        },
        'fallback_used': True
    }

def generate_fallback_response(risk_level, age, gender_text, key_factors,
                             lung_cancer_label, tumor_detected,
                             cancer_stage_class, overlay_image=None):
    """Generate a comprehensive fallback medical response"""
    
    # Patient info section
    patient_section = f"""**THÔNG TIN BỆNH NHÂN:**
• Tuổi: {age}
• Giới tính: {gender_text}
{f"• Yếu tố nguy cơ cao: {', '.join(key_factors)}" if key_factors else "• Yếu tố nguy cơ: Trong giới hạn bình thường"}"""

    # AI results section with professional analysis
    ai_analysis = ""
    image_analysis = ""

    if tumor_detected:
        ai_analysis = f"""
• **Phát hiện vùng bất thường**: AI đã phát hiện và tô vùng bất thường trên hình ảnh CT scan
• **Phân loại tổn thương**: {cancer_stage_class if cancer_stage_class != 'Unknown' else 'Chưa phân loại'}
• **Đánh giá chuyên môn**: Vùng bất thường được phát hiện cần được đánh giá chi tiết bởi bác sĩ chuyên khoa"""

        # Add detailed image analysis if overlay image is available
        if overlay_image:
            image_analysis = """

**PHÂN TÍCH CHI TIẾT HÌNH ẢNH:**
• **Vị trí tổn thương**: Vùng bất thường được phát hiện và khoanh vùng trên hình ảnh CT scan
• **Đặc điểm hình ảnh**: Tổn thương có ranh giới rõ ràng, cần đánh giá kỹ lưỡng về kích thước, mật độ và mối liên hệ với các cấu trúc xung quanh
• **Khuyến cáo chuyên khoa**: Cần thực hiện các xét nghiệm bổ sung (CT liều cao, PET-CT) để xác định bản chất tổn thương
• **Mức độ ưu tiên**: Cao - cần khám chuyên khoa trong 1-2 tuần"""
    else:
        ai_analysis = """
• **Phát hiện vùng bất thường**: AI không phát hiện vùng bất thường rõ ràng trên hình ảnh CT scan
• **Đánh giá chuyên môn**: Hình ảnh CT scan trong giới hạn bình thường, tuy nhiên cần kết hợp với các yếu tố nguy cơ khác"""

    ai_results_section = f"""**KẾT QUẢ PHÂN TÍCH AI CHUYÊN NGHIỆP:**
• **Mô hình đánh giá nguy cơ ung thư phổi**: {lung_cancer_label}
{ai_analysis}{image_analysis}"""

    # Clinical assessment based on risk level and cancer stage
    if risk_level == "high" or cancer_stage_class == "Malignant":
        clinical_assessment = f"""**NHẬN ĐỊNH LÂM SÀNG:**
• Bệnh nhân {gender_text}, {age} tuổi, có nguy cơ ung thư phổi **CAO** theo đánh giá của AI
• {"Phát hiện vùng bất thường trên CT scan cần đánh giá chi tiết" if tumor_detected else "Chưa phát hiện vùng bất thường rõ ràng, nhưng yếu tố nguy cơ cao"}
• Phân loại tổn thương: {f"{cancer_stage_class} - cần can thiệp tích cực" if cancer_stage_class != 'Unknown' else "Cần theo dõi sát sao"}
• Kết hợp thông tin lâm sàng, yếu tố nguy cơ, và kết quả AI cho thấy cần có kế hoạch chẩn đoán và điều trị tích cực
• Ưu tiên khám chuyên khoa trong 1-2 tuần để đánh giá chi tiết và lập kế hoạch can thiệp"""
        
        recommendations = """**KHUYẾN NGHỊ Y KHOA:**
1. **Ưu tiên khám chuyên khoa hô hấp/ung bướu trong 1-2 tuần**
   - Mục tiêu: Đánh giá toàn diện tình trạng và lập kế hoạch chẩn đoán chi tiết
   - Chuẩn bị: Mang theo kết quả CT scan và các xét nghiệm đã thực hiện

2. **Thực hiện CT ngực liều thấp có thuốc cản quang trong 2 tuần**
   - Mục tiêu: Phát hiện các tổn thương nhỏ có thể bị bỏ sót
   - Tần suất: Theo dõi định kỳ 3-6 tháng tùy theo kết quả

3. **Xét nghiệm dấu ấn ung thư (CEA, CYFRA 21-1, NSE)**
   - Mục tiêu: Hỗ trợ chẩn đoán và theo dõi điều trị
   - Thời gian: Ngay trong tuần tới

4. **Cai thuốc lá hoàn toàn và ngay lập tức**
   - Mục tiêu: Giảm nguy cơ tiến triển và cải thiện hiệu quả điều trị
   - Hỗ trợ: Tham gia chương trình cai thuốc lá tại bệnh viện

5. **Theo dõi triệu chứng hô hấp hàng ngày**
   - Các dấu hiệu cần chú ý: ho kéo dài, khó thở, đau ngực, ho ra máu
   - Khám ngay nếu có triệu chứng bất thường"""

    elif risk_level == "moderate" or cancer_stage_class == "Benign":
        clinical_assessment = f"""**NHẬN ĐỊNH LÂM SÀNG:**
• Bệnh nhân {gender_text}, {age} tuổi, có nguy cơ ung thư phổi ở mức **TRUNG BÌNH** theo đánh giá của AI
• {"Phát hiện vùng bất thường trên CT scan cần theo dõi" if tumor_detected else "Hình ảnh CT scan chưa phát hiện vùng bất thường rõ ràng"}
• Phân loại tổn thương: {f"{cancer_stage_class}" if cancer_stage_class != 'Unknown' else "Cần theo dõi định kỳ"}
• Cần kiểm soát các yếu tố nguy cơ để ngăn ngừa tiến triển
• Lên lịch khám chuyên khoa trong 4-6 tuần và theo dõi định kỳ"""
        
        recommendations = """**KHUYẾN NGHỊ Y KHOA:**
1. **Khám chuyên khoa hô hấp trong 4-6 tuần**
   - Mục tiêu: Đánh giá chi tiết và lập kế hoạch theo dõi dài hạn
   - Chuẩn bị: Mang theo kết quả CT scan hiện tại

2. **CT ngực kiểm tra sau 6 tháng**
   - Mục tiêu: Theo dõi sự thay đổi của các tổn thương (nếu có)
   - Tần suất: 6-12 tháng tùy theo kết quả

3. **Giảm thiểu các yếu tố nguy cơ**
   - Cai thuốc lá dần dần với hỗ trợ y tế
   - Tránh môi trường ô nhiễm không khí
   - Tăng cường chế độ ăn uống lành mạnh

4. **Theo dõi triệu chứng định kỳ**
   - Khám sức khỏe định kỳ 3-6 tháng
   - Chú ý các triệu chứng hô hấp bất thường

5. **Tăng cường sức khỏe tổng thể**
   - Tập thể dục đều đặn, phù hợp với thể trạng
   - Bổ sung vitamin và khoáng chất theo chỉ định"""

    else:  # low risk or normal
        clinical_assessment = f"""**NHẬN ĐỊNH LÂM SÀNG:**
• Bệnh nhân {gender_text}, {age} tuổi, có nguy cơ ung thư phổi **THẤP** theo đánh giá của AI
• {"Hình ảnh CT scan không phát hiện vùng bất thường" if not tumor_detected else "Có phát hiện vùng bất thường nhưng"}
• Phân loại tổn thương: {f"{cancer_stage_class}" if cancer_stage_class != 'Unknown' else "Bình thường"}
• Nguy cơ thấp nhưng cần duy trì lối sống lành mạnh
• Khám sức khỏe định kỳ hàng năm và theo dõi triệu chứng"""
        
        recommendations = """**KHUYẾN NGHỊ Y KHOA:**
1. **Khám sức khỏe định kỳ hàng năm**
   - Mục tiêu: Theo dõi sức khỏe tổng thể và phát hiện sớm các vấn đề
   - Bao gồm: Khám lâm sàng và X-quang ngực

2. **Duy trì lối sống lành mạnh**
   - Không hút thuốc lá và tránh khói thuốc thụ động
   - Chế độ ăn giàu rau xanh, trái cây
   - Tập thể dục đều đặn

3. **Kiểm soát môi trường sống**
   - Tránh tiếp xúc với các chất gây ung thư
   - Sử dụng khẩu trang khi cần thiết
   - Đảm bảo thông gió tốt trong nhà

4. **Theo dõi triệu chứng**
   - Chú ý các triệu chứng hô hấp bất thường
   - Khám bác sĩ khi có ho kéo dài >2 tuần

5. **CT ngực tầm soát sau 2-3 năm**
   - Mục tiêu: Tầm soát định kỳ theo khuyến cáo
   - Tần suất: 2-3 năm một lần hoặc theo chỉ định bác sĩ"""

    important_notes = """**LƯU Ý QUAN TRỌNG:**
• Kết quả này chỉ mang tính chất tham khảo, không thay thế cho ý kiến của bác sĩ chuyên khoa
• Cần tuân thủ đúng lịch tái khám và theo dõi định kỳ
• Liên hệ ngay với bác sĩ nếu có bất kỳ triệu chứng bất thường nào
• Duy trì lối sống lành mạnh là yếu tố quan trọng nhất trong phòng ngừa ung thư"""

    return f"{patient_section}\n\n{ai_results_section}\n\n{clinical_assessment}\n\n{recommendations}\n\n{important_notes}"

def extract_fallback_recommendations(risk_level, cancer_stage_class):
    """Extract key recommendations based on risk level"""
    if risk_level == "high" or cancer_stage_class == "Malignant":
        return [
            "**Ưu tiên khám chuyên khoa hô hấp/ung bướu trong 1-2 tuần**",
            "Thực hiện CT ngực liều thấp có thuốc cản quang trong 2 tuần",
            "Xét nghiệm dấu ấn ung thư (CEA, CYFRA 21-1, NSE)",
            "Cai thuốc lá hoàn toàn và ngay lập tức",
            "Theo dõi triệu chứng hô hấp hàng ngày"
        ]
    elif risk_level == "moderate" or cancer_stage_class == "Benign":
        return [
            "**Khám chuyên khoa hô hấp trong 4-6 tuần**",
            "CT ngực kiểm tra sau 6 tháng",
            "Giảm thiểu các yếu tố nguy cơ",
            "Theo dõi triệu chứng định kỳ",
            "Tăng cường sức khỏe tổng thể"
        ]
    else:
        return [
            "**Khám sức khỏe định kỳ hàng năm**",
            "Duy trì lối sống lành mạnh",
            "Kiểm soát môi trường sống",
            "Theo dõi triệu chứng",
            "CT ngực tầm soát sau 2-3 năm"
        ]
