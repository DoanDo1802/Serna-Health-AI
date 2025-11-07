"""
Main Flask application - Medical AI API
Modular architecture with separated concerns
"""
from flask import Flask
from flask_cors import CORS
from config import Config
from models.model_loader import load_all_models

# Import route blueprints
from routes.health import health_bp
from routes.prediction import prediction_bp
from routes.chat import chat_bp
from routes.recommendations import recommendations_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app, origins=Config.CORS_ORIGINS)
    
    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(prediction_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(recommendations_bp)
    
    # Load AI models on startup
    with app.app_context():
        load_all_models()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host='127.0.0.1',
        port=5001,
        debug=Config.DEBUG
    )
