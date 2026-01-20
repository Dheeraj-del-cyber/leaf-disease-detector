# Plant Leaf Disease Detection

A full-stack web application for detecting plant leaf diseases using image processing.

## Features

- Upload leaf images
- Analyze images for disease detection
- Display results with disease percentage

## Tech Stack

- Frontend: React with Vite
- Backend: Python FastAPI
- Image Processing: OpenCV

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the server:
   ```
   uvicorn main:app --reload
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## Usage

1. Start both backend and frontend servers.
2. Open the frontend in your browser (usually http://localhost:5173).
3. Upload a leaf image.
4. Click "Detect Disease" to analyze the image.
5. View the results.