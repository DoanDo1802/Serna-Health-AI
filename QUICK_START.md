# 🚀 Quick Start Guide - Serna Health AI

## ✅ Hiện tại đã sẵn sàng:

### 🎨 Frontend (Next.js)

- **URL**: http://localhost:3000
- **Status**: ✅ Đang chạy
- **Features**:
  - 🔐 Authentication (Login/Register)
  - 🧠 Tumor Segmentation
  - 🎯 Cancer Stage Classification
  - 🫁 Lung Cancer Risk Prediction
  - 🤖 AI Recommendations
  - 📱 Responsive design
  - ⚡ Optimized animations 
  - 🔄 Loading spinners

### 🔧 Backend (Flask API)

- **Status**: ✅ Sẵn sàng
- **Port**: 5001
- **Features**:
  - 🧠 U-Net Tumor Segmentation
  - 🎯 YOLO Cancer Classification
  - 🫁 XGBoost Risk Prediction
  - 🤖 Gemini AI Recommendations
  - 💬 Chat with AI

## 🎯 Cách test ngay

### 1. Chuẩn bị Environment

```bash
# Tạo file .env.local trong frontend_v2/
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 2. Chạy Backend

```bash
cd backend
source venv/bin/activate
export GEMINI_API_KEY="your_gemini_api_key"
python app.py
```

Backend sẽ chạy tại: `http://localhost:5001`

### 3. Chạy Frontend

```bash
cd frontend_v2
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 4. Test Full App

1. **Đăng nhập/Đăng ký**: Tạo tài khoản mới
2. **Upload ảnh**: Chọn ảnh CT scan
3. **Phân tích**: Hệ thống sẽ:
   - Phân đoạn u (U-Net)
   - Phân loại nguy cơ ung thư (YOLO)
   - Dự đoán nguy cơ (XGBoost)
   - Tạo khuyến nghị (Gemini AI)
4. **Xem kết quả**: Khuyến nghị chi tiết từ AI

## 📊 Models sẵn sàng

- ✅ `improved_unet_final.h5` (Dice: 85.16%) - Tumor Segmentation
- ✅ `lung_cancer_xgb_model.pkl` + `lung_cancer_scaler.pkl` - Risk Prediction
- ✅ `lungcancer-cls.pt` - Cancer Stage Classification
- ✅ Gemini AI - Medical Recommendations

## 🎉 Demo Features

### 🔐 Authentication

- Đăng ký tài khoản mới
- Đăng nhập với email/password
- Quản lý profile

### 🧠 Tumor Segmentation

- Upload ảnh CT scan (PNG/JPG)
- Điều chỉnh threshold (0.1-0.9)
- Xem kết quả: có/không u, diện tích, confidence
- Hiển thị mask phân đoạn

### 🎯 Cancer Stage Classification

- Phân loại: Normal / Benign / Malignant
- Độ tin cậy (confidence score)
- Phân tích chi tiết

### 🫁 Lung Cancer Risk Prediction

- Form 23 thông số (age, gender, smoking, etc.)
- Dự đoán: Low/Medium/High risk
- Phân tích xác suất chi tiết

### 🤖 AI Recommendations

- Khuyến nghị y khoa tự động
- Phân tích chi tiết hình ảnh
- Nhận định lâm sàng
- Lưu ý quan trọng

## 🔧 Troubleshooting

### Nếu Backend lỗi

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY="your_key"
python app.py
```

### Nếu Frontend lỗi

```bash
cd frontend_v2
rm -rf .next node_modules
npm install
npm run dev
```

### Port đã được sử dụng

```bash
# Tìm process sử dụng port
lsof -i :5001  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

### Lỗi CORS

- Kiểm tra `backend/app.py` có CORS enabled
- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`

### Lỗi Model

- Đảm bảo tất cả file model trong `backend/models/`
- Kiểm tra file permissions

## 📝 Next Steps

1. ✅ Chuẩn bị environment variables
2. 🚀 Chạy Backend server
3. 🚀 Chạy Frontend server
4. 🔐 Đăng ký tài khoản
5. 🎯 Upload ảnh CT scan
6. 🤖 Xem khuyến nghị từ AI
7. 🎉 Enjoy Serna Health AI!

**Estimated time to complete: ~5-10 minutes** ⏰

## 📞 Support

Nếu gặp vấn đề, kiểm tra:

1. Backend logs: `python app.py`
2. Frontend logs: Browser console (F12)
3. Network tab: Kiểm tra API calls
4. Supabase dashboard: Kiểm tra authentication
