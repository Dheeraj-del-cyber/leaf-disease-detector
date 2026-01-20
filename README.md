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

## Deployment

### Frontend (GitHub Pages / Vercel / Netlify)

1. **Set Environment Variable**: Create a `.env` file in the `frontend` directory:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
   Or set it in your hosting platform's environment variables.

2. **Build**: 
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**: Upload the `dist` folder to your hosting service.

**Note**: The app uses `HashRouter` for GitHub Pages compatibility. URLs will look like `https://yoursite.com/#/` instead of `https://yoursite.com/`.

### Backend (Heroku / Railway / Render / etc.)

1. **Set Environment Variable** (optional): Create a `.env` file or set in your hosting platform:
   ```
   CORS_ORIGINS=https://your-frontend-url.com,http://localhost:5173
   ```

2. **Deploy**: Push to your hosting platform. Make sure:
   - Python 3.11+ is available
   - Dependencies are installed from `requirements.txt`
   - Server runs on the port provided by the platform (usually via `PORT` env variable)

3. **Update Frontend**: Point `VITE_API_URL` to your deployed backend URL.

### Important Notes

- **CORS**: The backend allows requests from `localhost:5173-5175` and `https://dheeraj-del-cyber.github.io` by default. Add more origins via the `CORS_ORIGINS` environment variable.
- **API URL**: The frontend defaults to `http://localhost:8000` if `VITE_API_URL` is not set. Always set this for production deployments.