# Emotion Detection AI

AI-powered emotion recognition system for images and real-time detection.

## Features

- Face emotion detection from images
- Multiple upload methods:
  - File upload from computer
  - Clipboard paste (Ctrl+V)
  - URL image loading
- Model metrics visualization
- Confidence percentage display

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- Virtual environment (recommended)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd detection-emoji-face-AI
```

2. Set up the backend
```bash
# Create and activate virtual environment
cd backend
python -m venv .venv
source .venv/bin/activate  # for Linux/Mac
# or
.venv\Scripts\activate     # for Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

3. Set up the frontend
```bash
# Open new terminal
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev
```

4. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5005

## API Endpoints

- `POST /predict` - Upload image for emotion detection
- `GET /metrics` - Get model training metrics

## Technologies

### Frontend
- React 18
- Vite
- Modern CSS

### Backend
- Flask 2.3
- TensorFlow
- OpenCV
- NumPy

## Project Structure
```
detection-emoji-face-AI/
├── backend/
│   ├── app.py           # Flask server
│   ├── train_model.py   # Model training script
│   ├── model/           # Model directory
│   │   ├── emotion_model.h5
│   │   └── metrics.json
│   └── requirements.txt
├── frontend/
│   ├── src/            # React components
│   ├── public/         # Static files
│   └── package.json
└── README.md
```

## Model Performance

- Training accuracy: 60.07%
- Validation accuracy: 54.21%
- Supported emotions: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral

## Troubleshooting

1. If backend fails to start:
   - Check if port 5005 is available
   - Verify all dependencies are installed
   - Ensure model files are present in backend/model/

2. If frontend fails to start:
   - Check if port 5173 is available
   - Clear npm cache: `npm clean-cache`
   - Delete node_modules and reinstall

## License

MIT

## Author

[Maksym Torbenko, Maksym Liashenko]
