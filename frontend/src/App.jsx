import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

// Get API URL from environment variable, fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/" className="nav-link">🏠 Home</Link>
          <Link to="/history" className="nav-link">📜 History</Link>
        </nav>
        <Routes>
          <Route path="/" element={<DetectionPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

function DetectionPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setResult(null)
    
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/detect`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)
      
      // Save to history
      const historyItem = {
        id: Date.now(),
        image: preview,
        result: data,
        timestamp: new Date().toISOString()
      }
      const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
      history.unshift(historyItem)
      localStorage.setItem('detectionHistory', JSON.stringify(history.slice(0, 10))) // Keep last 10
    } catch (error) {
      setResult({ message: `Error detecting disease: ${error.message}` })
    }
    setLoading(false)
  }

  return (
    <>
      <h1>🌿 Plant Leaf Disease Detection</h1>
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
          </div>
        )}
        <button onClick={handleUpload} disabled={!file || loading}>
          {loading ? (
            <>
              <div className="loading"></div>
              Detecting...
            </>
          ) : (
            'Detect Disease'
          )}
        </button>
      </div>
      {result && (
        <div className="result">
          <h2>🔍 Result:</h2>
          <p><strong>Disease:</strong> {result.disease_name}</p>
          <p>{result.message}</p>
          {result.disease_percentage !== undefined && (
            <p><strong>Disease Percentage:</strong> {result.disease_percentage}%</p>
          )}
          {result.precautions && result.precautions.length > 0 && (
            <div className="precautions">
              <h3>🛡️ Recommended Precautions:</h3>
              <ul>
                {result.precautions.map((precaution, index) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function HistoryPage() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('detectionHistory') || '[]')
    } catch {
      return []
    }
  })

  const deleteItem = (id) => {
    const updatedHistory = history.filter(item => item.id !== id)
    setHistory(updatedHistory)
    localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory))
  }

  return (
    <>
      <h1>📜 Detection History</h1>
      {history.length === 0 ? (
        <p>No detection history yet. Upload some images to get started!</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item">
              <img src={item.image} alt="Detection" className="history-image" />
              <div className="history-details">
                <p><strong>Disease:</strong> {item.result.disease_name}</p>
                <p><strong>Percentage:</strong> {item.result.disease_percentage}%</p>
                <p><strong>Date:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                {item.result.precautions && item.result.precautions.length > 0 && (
                  <details>
                    <summary>Precautions</summary>
                    <ul>
                      {item.result.precautions.map((precaution, index) => (
                        <li key={index}>{precaution}</li>
                      ))}
                    </ul>
                  </details>
                )}
                <button onClick={() => deleteItem(item.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default App
