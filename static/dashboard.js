// Fetch model data and create charts
let modelData = [];

async function loadModelData() {
    try {
        const response = await fetch('/api/models');
        modelData = await response.json();
        
        if (modelData.length > 0) {
            createCharts();
            populateTable();
        } else {
            // Use sample data if no data available
            useSampleData();
        }
    } catch (error) {
        console.error('Error loading model data:', error);
        useSampleData();
    }
}

function useSampleData() {
    modelData = [
        { Model: 'Passive Aggressive', 'F1-Score (Macro)': 0.8115, 'F1-Score (Weighted)': 0.8632, Accuracy: 0.8705, 'Training Time (s)': 1.65 },
        { Model: 'Linear SVM', 'F1-Score (Macro)': 0.7961, 'F1-Score (Weighted)': 0.8586, Accuracy: 0.8700, 'Training Time (s)': 1.48 },
        { Model: 'SGD Classifier', 'F1-Score (Macro)': 0.7793, 'F1-Score (Weighted)': 0.8524, Accuracy: 0.8665, 'Training Time (s)': 1.24 },
        { Model: 'K-Nearest Neighbors', 'F1-Score (Macro)': 0.7098, 'F1-Score (Weighted)': 0.7783, Accuracy: 0.7905, 'Training Time (s)': 3.54 },
        { Model: 'Random Forest', 'F1-Score (Macro)': 0.6897, 'F1-Score (Weighted)': 0.7942, Accuracy: 0.8145, 'Training Time (s)': 7.81 },
        { Model: 'Logistic Regression', 'F1-Score (Macro)': 0.6293, 'F1-Score (Weighted)': 0.7859, Accuracy: 0.8165, 'Training Time (s)': 13.05 },
        { Model: 'Decision Tree', 'F1-Score (Macro)': 0.6273, 'F1-Score (Weighted)': 0.7161, Accuracy: 0.7165, 'Training Time (s)': 23.27 },
        { Model: 'Multinomial Naive Bayes', 'F1-Score (Macro)': 0.4429, 'F1-Score (Weighted)': 0.6322, Accuracy: 0.6930, 'Training Time (s)': 0.15 },
        { Model: 'Bernoulli Naive Bayes', 'F1-Score (Macro)': 0.3107, 'F1-Score (Weighted)': 0.4783, Accuracy: 0.5000, 'Training Time (s)': 0.18 },
        { Model: 'Extra Trees', 'F1-Score (Macro)': 0.7234, 'F1-Score (Weighted)': 0.8012, Accuracy: 0.8234, 'Training Time (s)': 8.92 }
    ];
    
    createCharts();
    populateTable();
}

function createCharts() {
    // Sort by F1-Score for better visualization
    const sortedData = [...modelData].sort((a, b) => b['F1-Score (Macro)'] - a['F1-Score (Macro)']);
    
    const labels = sortedData.map(d => d.Model);
    const f1Scores = sortedData.map(d => d['F1-Score (Macro)']);
    const accuracies = sortedData.map(d => d.Accuracy);
    const times = sortedData.map(d => d['Training Time (s)']);
    
    // F1-Score Chart
    new Chart(document.getElementById('f1Chart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'F1-Score (Macro)',
                data: f1Scores,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { 
                        color: '#cbd5e1',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { display: false }
                }
            }
        }
    });
    
    // Accuracy Chart
    new Chart(document.getElementById('accuracyChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Accuracy',
                data: accuracies,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { 
                        color: '#cbd5e1',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { display: false }
                }
            }
        }
    });
    
    // Training Time Chart
    new Chart(document.getElementById('timeChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Training Time (seconds)',
                data: times,
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                },
                x: {
                    ticks: { 
                        color: '#cbd5e1',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { display: false }
                }
            }
        }
    });
    
    // Scatter Plot - Accuracy vs Training Time
    new Chart(document.getElementById('scatterChart'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Models',
                data: modelData.map(d => ({
                    x: d['Training Time (s)'],
                    y: d['F1-Score (Macro)'],
                    label: d.Model
                })),
                backgroundColor: 'rgba(129, 140, 248, 0.8)',
                borderColor: 'rgba(129, 140, 248, 1)',
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return `${point.label}: F1=${point.y.toFixed(4)}, Time=${point.x.toFixed(2)}s`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'F1-Score (Macro)',
                        color: '#cbd5e1'
                    },
                    beginAtZero: true,
                    max: 1,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Training Time (seconds)',
                        color: '#cbd5e1'
                    },
                    beginAtZero: true,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: '#334155' }
                }
            }
        }
    });
}

function populateTable() {
    const tbody = document.getElementById('modelTableBody');
    tbody.innerHTML = '';
    
    // Sort by F1-Score
    const sortedData = [...modelData].sort((a, b) => b['F1-Score (Macro)'] - a['F1-Score (Macro)']);
    
    sortedData.forEach((model, index) => {
        const row = document.createElement('tr');
        
        let rankBadge = '';
        if (index === 0) rankBadge = '<span class="rank-badge rank-1">1st</span>';
        else if (index === 1) rankBadge = '<span class="rank-badge rank-2">2nd</span>';
        else if (index === 2) rankBadge = '<span class="rank-badge rank-3">3rd</span>';
        else rankBadge = `<span class="rank-badge">${index + 1}</span>`;
        
        row.innerHTML = `
            <td>${rankBadge}</td>
            <td><strong>${model.Model}</strong></td>
            <td>${model['F1-Score (Macro)'].toFixed(4)}</td>
            <td>${model['F1-Score (Weighted)'].toFixed(4)}</td>
            <td>${model.Accuracy.toFixed(4)}</td>
            <td>${model['Training Time (s)'].toFixed(2)}s</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', loadModelData);
