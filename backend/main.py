from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from PIL import Image
import io
import os

app = FastAPI()

# Get allowed origins from environment variable, or use defaults
allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:5175,https://dheeraj-del-cyber.github.io"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_disease(image_bytes):
    # Load image
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Convert to HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define range for brown/yellow spots (diseased areas)
    lower_disease = np.array([5, 50, 50])
    upper_disease = np.array([30, 255, 255])
    
    # Threshold the HSV image to get only diseased colors
    mask = cv2.inRange(hsv, lower_disease, upper_disease)
    
    # Calculate percentage of diseased pixels
    total_pixels = image.shape[0] * image.shape[1]
    diseased_pixels = cv2.countNonZero(mask)
    disease_percentage = (diseased_pixels / total_pixels) * 100
    
    # Determine disease type and precautions
    if disease_percentage > 20:
        disease_name = "Bacterial Leaf Spot"
        precautions = [
            "Remove and destroy infected leaves immediately",
            "Improve air circulation around plants",
            "Avoid overhead watering to prevent spread",
            "Apply copper-based bactericide if available",
            "Ensure plants are not overcrowded"
        ]
        message = f"Disease detected: {disease_name}. Immediate action recommended."
    elif disease_percentage > 10:
        disease_name = "Fungal Infection"
        precautions = [
            "Apply appropriate fungicide as per plant type",
            "Ensure proper drainage to prevent waterlogging",
            "Space plants adequately for better airflow",
            "Remove fallen leaves from the ground",
            "Water at the base of plants, not on leaves"
        ]
        message = f"Disease detected: {disease_name}. Treatment advised."
    elif disease_percentage > 5:
        disease_name = "Early Disease Signs"
        precautions = [
            "Monitor the plant closely for progression",
            "Improve overall plant health with proper nutrition",
            "Ensure adequate sunlight and watering",
            "Quarantine affected plants if possible",
            "Consult local agricultural extension for specific advice"
        ]
        message = f"Early signs of disease detected. Preventive measures recommended."
    else:
        disease_name = "Healthy"
        precautions = []
        message = "Leaf appears healthy. Continue good care practices."
    
    return {
        "is_diseased": disease_percentage > 5,
        "disease_percentage": round(disease_percentage, 2),
        "disease_name": disease_name,
        "precautions": precautions,
        "message": message
    }

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        result = detect_disease(contents)
        return result
    except Exception as e:
        return {"message": f"Error processing image: {str(e)}", "is_diseased": False, "disease_percentage": 0}

@app.get("/")
async def root():
    return {"message": "Plant Leaf Disease Detection API"}