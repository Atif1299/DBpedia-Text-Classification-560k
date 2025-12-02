# DBpedia Classifier - Cloud Run Deployment

This folder contains everything needed to deploy the DBpedia Text Classification application to Google Cloud Run.

## 📂 Folder Structure

```
DBpedia-Deployment/
├── app.py                  # Flask backend application
├── Dockerfile              # Container configuration for Cloud Run
├── requirements.txt        # Python dependencies
├── best_model.pkl          # Trained model file
├── tfidf_vectorizer.pkl    # TF-IDF vectorizer
├── best_model_name.txt     # Name of the best model
├── static/                 # CSS and JavaScript files
└── templates/              # HTML templates
```

## 🚀 Deployment Steps

### Option 1: Deploy from Source (Easiest)

1. **Install Google Cloud SDK** if you haven't already.

2. **Login to Google Cloud:**
   ```bash
   gcloud auth login
   ```

3. **Set your project ID:**
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

4. **Deploy to Cloud Run:**
   Run this command from inside the `DBpedia-Deployment` folder:
   ```bash
   gcloud run deploy dbpedia-classifier --source . --platform managed --region us-central1 --allow-unauthenticated
   ```
   - When asked to enable APIs, say **yes**.
   - When asked to allow unauthenticated invocations, say **yes**.

### Option 2: Deploy via GitHub (Continuous Deployment)

1. **Create a new GitHub repository** (e.g., `dbpedia-classifier`).
2. **Push the contents of this folder** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dbpedia-classifier.git
   git push -u origin main
   ```
3. **Go to Google Cloud Console** -> **Cloud Run**.
4. Click **Create Service**.
5. Select **Continuously deploy new revisions from a source repository**.
6. Click **Set up with Cloud Build**.
7. Connect your GitHub repository.
8. **Build Configuration:**
   - **Build Type:** Dockerfile
   - **Source location:** / (root of the repo)
9. Click **Create**.

## 🛠️ Local Testing

To test the application locally before deploying:

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the app:**
   ```bash
   python app.py
   ```

3. **Visit:** `http://localhost:5000`

## 🐳 Docker Testing (Optional)

If you want to test the Docker container locally:

1. **Build the image:**
   ```bash
   docker build -t dbpedia-app .
   ```

2. **Run the container:**
   ```bash
   docker run -p 8080:8080 dbpedia-app
   ```

3. **Visit:** `http://localhost:8080`
