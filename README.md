# 🏥 Serna Health AI - Medical AI Analysis Platform

Ứng dụng web hiện đại để phân tích hình ảnh y tế và dự đoán nguy cơ ung thư phổi:

1. **🧠 Tumor Segmentation** - Phân đoạn vùng u trong ảnh CT scan (U-Net model)
2. **🫁 Lung Cancer Risk Prediction** - Dự đoán mức độ nguy cơ ung thư phổi (XGBoost model)
3. **🎯 Cancer Stage Classification** - Phân loại giai đoạn ung thư (YOLO model)
4. **🤖 AI Recommendations** - Khuyến nghị y khoa từ Gemini AI

## 📁 Cấu trúc Project

```
serna-v2/
├── backend/                      # Flask API server
│   ├── app.py                   # Main Flask application
│   ├── config.py                # Configuration settings
│   ├── requirements.txt         # Python dependencies
│   ├── models/                  # AI models
│   │   ├── improved_unet_final.h5
│   │   ├── lung_cancer_xgb_model.pkl
│   │   ├── lung_cancer_scaler.pkl
│   │   └── lungcancer-cls.pt    # YOLO model
│   ├── routes/                  # API routes
│   │   ├── health.py
│   │   ├── prediction.py
│   │   ├── chat.py
│   │   └── recommendations.py
│   ├── services/                # Business logic
│   │   ├── ai_service.py
│   │   └── fallback_service.py
│   └── utils/                   # Utilities
│       ├── image_utils.py
│       └── response_utils.py
├── frontend_v2/                 # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   ├── register/
│   │   └── home/
│   ├── components/              # React components
│   ├── lib/                     # Utilities
│   ├── package.json
│   └── tsconfig.json
├── README.md
├── QUICK_START.md
└── .env.example
```

## 🚀 Cách chạy ứng dụng

### 1. Cài đặt Backend (Flask API)

```bash
cd backend

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc: venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình environment variables
export GEMINI_API_KEY="your_gemini_api_key"
export SECRET_KEY="your_secret_key"

# Chạy server
python app.py
```

Backend sẽ chạy tại: `http://localhost:5001`

### 2. Cài đặt Frontend (Next.js)

```bash
cd frontend_v2

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 3. Cấu hình Environment

Tạo file `.env.local` trong `frontend_v2/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 🎯 Cách sử dụng

### 🔐 Đăng nhập / Đăng ký

1. Truy cập `http://localhost:3000`
2. Chọn "Sign in" hoặc "Sign up"
3. Nhập email và password
4. Xác thực qua Supabase

### 🧠 Tumor Segmentation

1. Chọn tab "Tumor Segmentation"
2. Upload ảnh CT scan (PNG, JPG, JPEG)
3. Điều chỉnh threshold (0.1-0.9) nếu cần
4. Click "Predict Tumor"
5. Xem kết quả:
   - Có phát hiện u hay không
   - Mask phân đoạn

### 🎯 Cancer Stage Classification

1. Upload ảnh CT scan
2. Hệ thống sẽ phân loại:
   - Normal (Bình thường)
   - Benign (Lành tính)
   - Malignant (Ác tính)
3. Xem kết quả phân loại và độ tin cậy

### 🫁 Lung Cancer Risk Prediction

1. Chọn tab "Lung Cancer Prediction"
2. Nhập thông tin bệnh nhân (23 thông số)
3. Click "Predict Risk"
4. Xem kết quả:
   - Mức độ nguy cơ: Low/Medium/High
   - Phân tích xác suất chi tiết

### 🤖 AI Recommendations

1. Sau khi phân tích xong, hệ thống sẽ tự động tạo khuyến nghị
2. Xem khuyến nghị y khoa từ Gemini AI
3. Khuyến nghị bao gồm:
   - Phân tích chi tiết hình ảnh
   - Nhận định lâm sàng
   - Khuyến nghị y khoa
   - Lưu ý quan trọng

## 📊 Thông tin Models

### 1. U-Net Model (Tumor Segmentation)

- **File**: `improved_unet_final.h5`
- **Dice Score**: 85.16%
- **IoU**: 74.25%
- **Input**: Ảnh CT scan 256x256 grayscale
- **Output**: Binary mask phân đoạn vùng u

### 2. XGBoost Model (Risk Prediction)

- **Files**: `lung_cancer_xgb_model.pkl`, `lung_cancer_scaler.pkl`
- **Input**: 23 thông số sức khỏe và thói quen sinh hoạt
- **Output**: Dự đoán mức độ nguy cơ ung thư phổi (Low/Medium/High)

### 3. YOLO Model (Cancer Classification)

- **File**: `lungcancer-cls.pt`
- **Purpose**: Phân loại giai đoạn ung thư
- **Output**: Normal / Benign / Malignant

### 4. Gemini AI (Medical Recommendations)

- **Purpose**: Tạo khuyến nghị y khoa chuyên nghiệp
- **Input**: Kết quả phân tích + thông tin bệnh nhân
- **Output**: Khuyến nghị chi tiết, phân tích lâm sàng

## 🛠️ API Endpoints

### Backend API (Port 5001)

#### Health Check

- `GET /health` - Health check
- `GET /` - API information

#### Predictions

- `POST /api/predict/lung-cancer` - Dự đoán nguy cơ ung thư phổi (23 thông số bệnh nhân)
- `POST /api/predict/tumor` - Phân đoạn vùng u trong ảnh CT scan
- `POST /api/predict/cancer-stage` - Phân loại giai đoạn ung thư

#### AI Services

- `POST /api/chat` - Chat với AI (hỗ trợ Health Mode với đầy đủ thông tin bệnh nhân)
- `POST /api/recommendations` - Tạo khuyến nghị y khoa từ Gemini AI

#### Health Mode Context

Khi Health Mode bật, chat AI nhận được:

- Thông tin bệnh nhân (tuổi, giới tính, tất cả health factors)
- Kết quả model (XGBoost, Tumor detection, Cancer stage)
- Nhận định lâm sàng chi tiết từ recommendations API

## 🔧 Troubleshooting

### Backend Issues

- Đảm bảo đã cài đặt đúng Python dependencies
- Kiểm tra các file model có tồn tại trong thư mục `backend/models/`
- TensorFlow có thể mất thời gian cài đặt (đặc biệt trên CPU)
- Kiểm tra GEMINI_API_KEY đã được cấu hình
- Nếu lỗi port 5001, thay đổi port trong `config.py`

### Frontend Issues

- Đảm bảo Node.js version >= 18
- Kiểm tra backend đã chạy tại port 5001
- CORS đã được cấu hình trong Flask app
- Xóa `.next` folder và rebuild: `npm run build`
- Kiểm tra Supabase credentials trong `.env.local`

### Common Issues

- **Port already in use**: Thay đổi port trong config hoặc kill process
- **Model not found**: Đảm bảo tất cả file model trong `backend/models/`
- **CORS error**: Kiểm tra CORS settings trong `backend/app.py`
- **Slow predictions**: Có thể do CPU, sử dụng GPU nếu có

## 📝 Notes

- Frontend sử dụng Next.js 15 với TypeScript
- Backend sử dụng Flask với CORS enabled
- Models được load một lần khi khởi động server
- Ảnh được resize tự động về 256x256 cho U-Net model
- Dữ liệu được chuẩn hóa tự động cho XGBoost model
- Authentication sử dụng Supabase
- AI recommendations sử dụng Google Gemini API
- Database sử dụng Supabase PostgreSQL

## � UI/UX Improvements

- 🔄 Loading spinner trên button khi đang xử lý
- 📱 Responsive design cho mobile/tablet/desktop
- 🎯 Nested bullet points với proper indentation

## 🚀 Tech Stack

### Frontend

- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth
- Motion (animations)

### Backend

- Flask
- TensorFlow (U-Net)
- XGBoost
- Ultralytics (YOLO)
- Google Generative AI (Gemini)
- Supabase

## 📄 License

MIT License

## 👥 Contributors

Serna Health AI Team

## 🎉 Ready to Use

Bạn có thể test toàn bộ ứng dụng Medical AI thông qua giao diện web hiện đại này!
