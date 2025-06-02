import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [emotion, setEmotion] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;
      const item = [...items].find((item) => item.type.indexOf("image") !== -1);

      if (item) {
        const file = item.getAsFile();
        handleImageFile(file);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);


  const handleImageFile = async (file) => {
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setEmotion(null);
      setError(null);
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("http://localhost:5005/predict", {
          method: "POST",
          body: formData,
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setEmotion(data);
        } else {
          setError(data.error || "Помилка розпізнавання");
        }
      } catch (error) {
        setError("Помилка з'єднання з сервером");
        console.error("Error:", error);
      }
      setLoading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });
      handleImageFile(file);
    } catch (error) {
      setError("Помилка завантаження зображення за URL");
      console.error("Error fetching image from URL:", error);
    }
  };

  const loadMetrics = async () => {
    setMetrics(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5005/metrics");
      const data = await res.json();
      if (res.ok) {
        setMetrics(data);
      } else {
        setError("Не вдалося отримати метрики");
      }
    } catch (error) {
      setError("Помилка з'єднання з сервером");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Emotion Detection</h1>

      <div className="upload-section">
        <label className="upload-button" htmlFor="file-input">
          Upload file
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>

        <div className="url-input-container">
          <input
            type="url"
            placeholder="Вставте URL зображення"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="url-input"
          />
          <button onClick={handleUrlSubmit} className="url-button">
            Upload
          </button>
        </div>

        <button
          onClick={loadMetrics}
          disabled={loading}
          className="metrics-button"
        >
          Показати метрики
        </button>
      </div>

      <div className="paste-hint">
        Ви також можете вставити зображення за допомогою Ctrl+V
      </div>

      {loading && <div className="loader">Download...</div>}
      {error && <div className="error">{error}</div>}

      <div className="results-container">
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Selected image" />
          </div>
        )}

        {emotion && !error && (
          <div className="emotion-result">
            <h3>Emoji:</h3>
            <p className="emotion-text">
              {emotion.emotion} ({(emotion.confidence * 100).toFixed(1)}%)
            </p>
          </div>
        )}
      </div>

      {metrics && (
        <div className="metrics-container">
          <h3>Metric model:</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <h4>Accuracy</h4>
              <p>
                {(metrics.accuracy[metrics.accuracy.length - 1] * 100).toFixed(
                  1
                )}
                %
              </p>
            </div>
            <div className="metric-card">
              <h4>Validation accuracy</h4>
              <p>
                {(
                  metrics.val_accuracy[metrics.val_accuracy.length - 1] * 100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
