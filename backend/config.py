"""
Configuration settings for the Flask application
"""
import os


def _to_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_cors_origins() -> list[str]:
    origins = os.environ.get("CORS_ORIGINS")
    if not origins:
        return ["http://localhost:3000", "http://127.0.0.1:3000"]
    return [origin.strip() for origin in origins.split(",") if origin.strip()]


class Config:
    # Flask settings
    DEBUG = _to_bool(os.environ.get("DEBUG"), default=False)
    SECRET_KEY = os.environ.get("SECRET_KEY") or "local-dev-secret-key"

    # CORS settings
    CORS_ORIGINS = _parse_cors_origins()
    
    # Model paths
    UNET_MODEL_PATH = 'models/improved_unet_final.h5'
    XGBOOST_MODEL_PATH = 'models/lung_cancer_xgb_model.pkl'
    SCALER_PATH = 'models/lung_cancer_scaler.pkl'
    YOLO_MODEL_PATH = 'models/lungcancer-cls.pt'
    
    # API settings
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    GEMINI_MODEL = 'gemini-2.5-flash'
    
    # Image processing settings
    IMAGE_SIZE = (256, 256)
    THRESHOLD_DEFAULT = 0.5
    
    # Response settings
    MAX_RECOMMENDATIONS = 5
    
    # Class mappings
    CANCER_STAGE_CLASSES = {0: 'Benign', 1: 'Malignant', 2: 'Normal'}

