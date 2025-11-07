"""
Model loader for all AI models
"""
import tensorflow as tf
import joblib
from ultralytics import YOLO
from config import Config

# Global model variables
UNET_MODEL = None
XGB_MODEL = None
SCALER = None
YOLO_CLS_MODEL = None

def load_all_models():
    """Load all AI models"""
    global UNET_MODEL, XGB_MODEL, SCALER, YOLO_CLS_MODEL
    
    try:
        # Load U-Net model
        if UNET_MODEL is None:
            UNET_MODEL = tf.keras.models.load_model(Config.UNET_MODEL_PATH, compile=False)
            print("U-Net model loaded successfully")
        
        # Load XGBoost model and scaler
        if XGB_MODEL is None:
            XGB_MODEL = joblib.load(Config.XGBOOST_MODEL_PATH)
            print("XGBoost model loaded successfully")
        
        if SCALER is None:
            SCALER = joblib.load(Config.SCALER_PATH)
            print("Scaler loaded successfully")
        
        # Load YOLO classification model
        if YOLO_CLS_MODEL is None:
            YOLO_CLS_MODEL = YOLO(Config.YOLO_MODEL_PATH)
            print("YOLO Classification model loaded successfully")
            
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        raise

def get_unet_model():
    """Get U-Net model instance"""
    if UNET_MODEL is None:
        load_all_models()
    return UNET_MODEL

def get_xgboost_model():
    """Get XGBoost model instance"""
    if XGB_MODEL is None:
        load_all_models()
    return XGB_MODEL

def get_scaler():
    """Get scaler instance"""
    if SCALER is None:
        load_all_models()
    return SCALER

def get_yolo_model():
    """Get YOLO classification model instance"""
    if YOLO_CLS_MODEL is None:
        load_all_models()
    return YOLO_CLS_MODEL
