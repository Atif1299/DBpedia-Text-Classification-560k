"""
Flask Backend for DBpedia Text Classification
Enhanced version with model comparison and statistics
"""

from flask import Flask, request, jsonify, render_template
import joblib
import string
import nltk
from nltk.corpus import stopwords
import pandas as pd
import os

# Download stopwords if not already downloaded
try:
    stop_words = set(stopwords.words('english'))
except:
    nltk.download('stopwords', quiet=True)
    stop_words = set(stopwords.words('english'))

app = Flask(__name__)

# Load the trained model and vectorizer
print("Loading model and vectorizer...")
model = joblib.load('best_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')
print("Model loaded successfully!")

# Load model info
with open('best_model_name.txt', 'r') as f:
    model_name = f.read().strip()

# Load model comparison data if available
model_comparison = None
if os.path.exists('model_comparison.csv'):
    model_comparison = pd.read_csv('model_comparison.csv')

def preprocess_text(text):
    """
    Preprocess text the same way as training data
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Remove stopwords
    words = text.split()
    words = [word for word in words if word not in stop_words]
    text = ' '.join(words)
    
    return text

@app.route('/')
def home():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Serve the dashboard page"""
    return render_template('dashboard.html')

@app.route('/predict', methods=['POST'])
def predict():
    """
    API endpoint for predictions
    Expects JSON: {"text": "your text here"}
    Returns JSON: {"category": "predicted category", "confidence": 0.95}
    """
    try:
        # Get text from request
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Preprocess the text
        processed_text = preprocess_text(text)
        
        # Vectorize
        text_vector = vectorizer.transform([processed_text])
        
        # Make prediction
        prediction = model.predict(text_vector)[0]
        
        # Get prediction probability if available
        try:
            probabilities = model.predict_proba(text_vector)[0]
            confidence = float(max(probabilities))
            
            # Get top 3 predictions
            top_indices = probabilities.argsort()[-3:][::-1]
            top_predictions = [
                {
                    'category': model.classes_[i],
                    'confidence': float(probabilities[i])
                }
                for i in top_indices
            ]
        except:
            confidence = None
            top_predictions = None
        
        # Return result
        result = {
            'category': prediction,
            'confidence': confidence,
            'top_predictions': top_predictions,
            'model': model_name,
            'preprocessed_text': processed_text,
            'word_count': len(processed_text.split())
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models')
def get_models():
    """Get model comparison data"""
    if model_comparison is not None:
        return jsonify(model_comparison.to_dict('records'))
    return jsonify([])

@app.route('/api/stats')
def get_stats():
    """Get project statistics"""
    stats = {
        'dataset': 'DBpedia',
        'total_samples': '560,000',
        'categories': 14,
        'features': '5,000 (TF-IDF)',
        'best_model': model_name,
        'preprocessing': ['Lowercase', 'Remove Punctuation', 'Remove Stopwords'],
        'models_trained': 10
    }
    return jsonify(stats)

@app.route('/health')
def health():
    """Health check endpoint for Cloud Run"""
    return jsonify({'status': 'healthy', 'model': model_name})

if __name__ == '__main__':
    # For local development
    app.run(host='0.0.0.0', port=5000, debug=False)
