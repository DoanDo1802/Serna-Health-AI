"""
Configuration settings for the Flask application
"""
import os

class Config:
    # Flask settings
    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    
    # CORS settings
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Model paths
    UNET_MODEL_PATH = 'models/improved_unet_final.h5'
    XGBOOST_MODEL_PATH = 'models/lung_cancer_xgb_model.pkl'
    SCALER_PATH = 'models/lung_cancer_scaler.pkl'
    YOLO_MODEL_PATH = 'models/lungcancer-cls.pt'
    
    # API settings
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    GEMINI_MODEL = 'gemini-2.0-flash'
    
    # Image processing settings
    IMAGE_SIZE = (256, 256)
    THRESHOLD_DEFAULT = 0.5
    
    # Response settings
    MAX_RECOMMENDATIONS = 5
    
    # Class mappings
    CANCER_STAGE_CLASSES = {0: 'Benign', 1: 'Malignant', 2: 'Normal'}

