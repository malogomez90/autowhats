import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Show loading state while React initializes
const loadingElement = document.createElement('div');
loadingElement.id = 'app-loading';
loadingElement.innerHTML = `
  <div style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
  ">
    <div style="
      width: 60px;
      height: 60px;
      border: 3px solid #3b82f6;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    "></div>
    <h2 style="font-size: 1.5rem; margin-bottom: 10px; color: #60a5fa;">Loading Security Simulator</h2>
    <p style="color: #9ca3af; max-width: 400px; text-align: center;">
      Initializing educational demo...
    </p>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  </div>
`;
document.body.appendChild(loadingElement);

// Initialize React
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove loading screen when app is ready
window.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure everything is loaded
  setTimeout(() => {
    const loadingElement = document.getElementById('app-loading');
    if (loadingElement) {
      loadingElement.style.opacity = '0';
      loadingElement.style.transition = 'opacity 0.5s ease';
      
      setTimeout(() => {
        if (loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }, 500);
    }
  }, 500);
});

// Error handling for React rendering
if (import.meta.hot) {
  import.meta.hot.accept();
}