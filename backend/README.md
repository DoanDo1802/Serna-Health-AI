# 🏥 Medical AI Backend - Modular Architecture

Serna Health AI Backend - Flask API server với 4 AI models tích hợp

## 📁 Project Structure

```
backend/
├── app.py                      # Main Flask application (entry point)
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── models/                     # AI Models
│   ├── improved_unet_final.h5  # U-Net tumor segmentation
│   ├── lung_cancer_xgb_model.pkl # XGBoost risk prediction
│   ├── lung_cancer_scaler.pkl  # XGBoost scaler
│   └── lungcancer-cls.pt       # YOLO cancer classification
├── routes/                     # API Routes (Blueprints)
│   ├── health.py               # Health check endpoints
│   ├── prediction.py           # AI prediction endpoints
│   ├── chat.py                 # Chat with AI endpoints
│   └── recommendations.py      # Medical recommendations
├── services/                   # Business Logic
│   ├── ai_service.py           # Gemini AI interactions
│   └── fallback_service.py     # Fallback responses
├── utils/                      # Utilities
│   ├── image_utils.py          # Image processing utilities
│   └── response_utils.py       # API response formatting
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
cd backend

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc: venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt
```

### 2. Cấu hình Environment

```bash
export GEMINI_API_KEY="your_gemini_api_key"
export SECRET_KEY="your_secret_key"
export FLASK_ENV="development"
```

### 3. Chạy Server

```bash
python app.py
```

Server sẽ chạy tại: `http://localhost:5001`

## 📋 API Endpoints

### Health Check
- `GET /health` - Health check
- `GET /` - API information

### Predictions
- `POST /api/predict/lung-cancer` - Lung cancer risk prediction
- `POST /api/predict/tumor` - Tumor segmentation
- `POST /api/predict/cancer-stage` - Cancer stage classification

### AI Services
- `POST /api/chat` - Chat with AI
- `POST /api/recommendations` - Medical recommendations

## 🔧 Configuration

Edit `config.py` to modify:
- Model paths
- API keys
- CORS settings
- Image processing parameters

## 🧠 AI Models

### 1. U-Net Model (Tumor Segmentation)

- **File**: `models/improved_unet_final.h5`
- **Purpose**: Detect and segment tumors in CT scans
- **Input**: 256x256 grayscale images
- **Output**: Binary segmentation mask
- **Performance**: Dice Score 85.16%, IoU 74.25%
- **Framework**: TensorFlow/Keras

### 2. XGBoost Model (Risk Prediction)

- **Files**: `models/lung_cancer_xgb_model.pkl`, `models/lung_cancer_scaler.pkl`
- **Purpose**: Predict lung cancer risk
- **Input**: 23 patient features (age, gender, smoking, etc.)
- **Output**: 'Low' | 'Medium' | 'High'
- **Framework**: XGBoost

### 3. YOLO Model (Cancer Classification)

- **File**: `models/lungcancer-cls.pt`
- **Purpose**: Classify cancer stage
- **Input**: RGB images
- **Output**: Normal / Benign / Malignant classification
- **Framework**: Ultralytics YOLO

### 4. Gemini AI (Recommendations)

- **Purpose**: Generate professional medical recommendations
- **Input**: Combined AI results + patient data
- **Output**: Detailed medical advice with analysis
- **Framework**: Google Generative AI (Gemini)

## 🛠 Development

### Adding New Routes
1. Create new blueprint in `routes/`
2. Register blueprint in `app.py`

### Adding New Models
1. Add model file to `models/`
2. Update `model_loader.py`
3. Create prediction function

### Adding New Services
1. Create service in `services/`
2. Import in relevant routes

## 📦 Dependencies

- **Flask** - Web framework
- **Flask-CORS** - CORS support
- **TensorFlow** - U-Net model
- **XGBoost** - Risk prediction
- **Ultralytics** - YOLO classification
- **Google Generative AI** - Recommendations
- **Pillow** - Image processing
- **NumPy** - Numerical computing
- **Pandas** - Data processing
- **Scikit-learn** - Machine learning utilities

## 🔒 Environment Variables

```bash
export GEMINI_API_KEY="your_gemini_api_key"
export SECRET_KEY="your_secret_key"
export FLASK_ENV="development"
export FLASK_DEBUG="1"
```

## 🧪 Testing

### Health Check

```bash
curl http://localhost:5001/health
```

### Tumor Segmentation

```bash
curl -X POST http://localhost:5001/api/predict/tumor \
  -F "image=@test_image.jpg" \
  -F "threshold=0.5"
```

### Cancer Stage Prediction

```bash
curl -X POST http://localhost:5001/api/predict/cancer-stage \
  -F "image=@test_image.jpg"
```

### Lung Cancer Risk Prediction

```bash
curl -X POST http://localhost:5001/api/predict/lung-cancer \
  -H "Content-Type: application/json" \
  -d '{
    "age": 65,
    "gender": 1,
    "smoking": 1,
    ...
  }'
```

### Medical Recommendations

```bash
curl -X POST http://localhost:5001/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "risk": 0.75,
    "label": "High",
    "tumorDetected": true,
    ...
  }'
```

## 📈 Benefits of Modular Architecture

1. **Maintainability**: Each module has single responsibility
2. **Scalability**: Easy to add new features
3. **Testing**: Individual components can be tested
4. **Reusability**: Services can be reused across routes
5. **Debugging**: Easier to locate and fix issues
6. **Team Development**: Multiple developers can work on different modules

## 🔧 Configuration

Edit `config.py` to modify:

- Model paths
- API keys
- CORS settings
- Image processing parameters
- Port and host settings

## 📝 Notes

- Models are loaded once at server startup
- Images are automatically resized to 256x256 for U-Net
- Patient data is automatically normalized for XGBoost
- All predictions include confidence scores
- Gemini AI provides detailed medical recommendations
- Fallback responses available when AI is unavailable

## 🚀 Deployment

### Production Setup

```bash
# Use Gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

### Docker

```bash
docker build -t serna-backend .
docker run -p 5001:5001 serna-backend
```

## 📞 Support

For issues or questions:

1. Check logs: `python app.py`
2. Verify model files exist
3. Check environment variables
4. Review API documentation
5. Test endpoints with curl

## 📄 License

MIT License

## 👥 Contributors

Serna Health AI Team
