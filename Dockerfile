FROM python:3.10-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK stopwords
RUN python -c "import nltk; nltk.download('stopwords', quiet=True)"

# Copy application files
COPY app.py .
COPY best_model.pkl .
COPY tfidf_vectorizer.pkl .
COPY best_model_name.txt .
COPY templates/ templates/
COPY static/ static/

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Run the application with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "8", "--timeout", "0", "app:app"]
