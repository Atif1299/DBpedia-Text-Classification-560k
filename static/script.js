const form = document.getElementById('classificationForm');
const textInput = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultCard = document.getElementById('resultCard');
const charCount = document.getElementById('charCount');

// Character counter
textInput.addEventListener('input', () => {
    charCount.textContent = textInput.value.length;
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Please enter some text to classify');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    resultCard.style.display = 'none';
    
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Display main result
            document.getElementById('category').textContent = data.category;
            document.getElementById('model').textContent = data.model;
            document.getElementById('wordCount').textContent = data.word_count;
            
            // Display confidence
            if (data.confidence !== null) {
                const confidencePercent = (data.confidence * 100).toFixed(2);
                document.getElementById('confidence').textContent = confidencePercent + '%';
                document.getElementById('confidenceBar').style.width = confidencePercent + '%';
                document.getElementById('confidenceContainer').style.display = 'block';
            } else {
                document.getElementById('confidenceContainer').style.display = 'none';
            }
            
            // Display top predictions
            if (data.top_predictions && data.top_predictions.length > 0) {
                const topPredsList = document.getElementById('topPredictionsList');
                topPredsList.innerHTML = '';
                
                data.top_predictions.forEach((pred, index) => {
                    const item = document.createElement('div');
                    item.className = 'prediction-item';
                    item.innerHTML = `
                        <span class="prediction-name">${index + 1}. ${pred.category}</span>
                        <span class="prediction-confidence">${(pred.confidence * 100).toFixed(2)}%</span>
                    `;
                    topPredsList.appendChild(item);
                });
                
                document.getElementById('topPredictions').style.display = 'block';
            } else {
                document.getElementById('topPredictions').style.display = 'none';
            }
            
            // Show result card
            resultCard.style.display = 'block';
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            alert('Error: ' + (data.error || 'Failed to classify text'));
        }
    } catch (error) {
        alert('Error: Failed to connect to the server');
        console.error('Error:', error);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
});

// Sample text examples
const sampleTexts = {
    person: "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity...",
    place: "Paris is the capital and most populous city of France...",
    company: "Apple Inc. is an American multinational technology company...",
};

// You can add quick fill buttons if needed
function fillSample(type) {
    textInput.value = sampleTexts[type];
    charCount.textContent = textInput.value.length;
}
