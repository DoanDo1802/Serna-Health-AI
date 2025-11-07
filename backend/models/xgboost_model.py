"""
XGBoost model operations for lung cancer risk prediction
"""
import pandas as pd
from models.model_loader import get_xgboost_model, get_scaler

def predict_lung_cancer_risk(patient_data):
    """Predict lung cancer risk using XGBoost model"""
    try:
        model = get_xgboost_model()
        scaler = get_scaler()

        # Create DataFrame with proper feature names (lowercase as in original model)
        df = pd.DataFrame([{
            'age': patient_data.get('age', 0),
            'gender': patient_data.get('gender', 0),
            'air_pollution': patient_data.get('air_pollution', 0),
            'alcohol_use': patient_data.get('alcohol_use', 0),
            'dust_allergy': patient_data.get('dust_allergy', 0),
            'occupational_hazards': patient_data.get('occupational_hazards', 0),
            'genetic_risk': patient_data.get('genetic_risk', 0),
            'chronic_lung_disease': patient_data.get('chronic_lung_disease', 0),
            'balanced_diet': patient_data.get('balanced_diet', 0),
            'obesity': patient_data.get('obesity', 0),
            'smoking': patient_data.get('smoking', 0),
            'passive_smoker': patient_data.get('passive_smoker', 0),
            'chest_pain': patient_data.get('chest_pain', 0),
            'coughing_of_blood': patient_data.get('coughing_of_blood', 0),
            'fatigue': patient_data.get('fatigue', 0),
            'weight_loss': patient_data.get('weight_loss', 0),
            'shortness_of_breath': patient_data.get('shortness_of_breath', 0),
            'wheezing': patient_data.get('wheezing', 0),
            'swallowing_difficulty': patient_data.get('swallowing_difficulty', 0),
            'clubbing_of_finger_nails': patient_data.get('clubbing_of_finger_nails', 0),
            'frequent_cold': patient_data.get('frequent_cold', 0),
            'dry_cough': patient_data.get('dry_cough', 0),
            'snoring': patient_data.get('snoring', 0)
        }])

        # Scale features
        scaled_features = scaler.transform(df)

        # Make prediction
        prediction = model.predict(scaled_features)[0]

        # Map prediction to label
        label_map = {0: "Low", 1: "Medium", 2: "High"}
        result_label = label_map[prediction]

        return {
            'prediction': result_label
        }

    except Exception as e:
        raise Exception(f"Error in lung cancer risk prediction: {str(e)}")


