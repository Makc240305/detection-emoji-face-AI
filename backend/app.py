from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

MODEL_PATH = "model/emotion_model.h5"
METRICS_PATH = "model/metrics.json"
emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

# Перевірка наявності моделі
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

model = load_model(MODEL_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    file = request.files['image']
    try:
        image = Image.open(file).convert('L').resize((48, 48))
        img_array = img_to_array(image) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        prediction = model.predict(img_array)[0]
        label = emotions[np.argmax(prediction)]
        confidence = float(np.max(prediction))
        return jsonify({"emotion": label, "confidence": confidence})
    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/metrics", methods=["GET"])
def metrics():
    if not os.path.exists(METRICS_PATH):
        return jsonify({"error": "Metrics file not found"}), 404
    try:
        with open(METRICS_PATH, "r") as f:
            return jsonify(json.load(f))
    except Exception as e:
        print("Metrics error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "API is running",
        "endpoints": {
            "/predict": "POST - Detect emotion from image",
            "/metrics": "GET - Get model metrics"
        }
    })

if __name__ == "__main__":
    print("Server is running on http://localhost:5005")
    app.run(host='0.0.0.0', port=5005, debug=True)