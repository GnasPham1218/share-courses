# app/main.py
from fastapi import FastAPI
from app.api.google_routes import router as google_router
from app.api.courses import router as course_router
app = FastAPI()

# Gắn các route vào app chính
app.include_router(google_router, prefix="/api/v1/google", tags=["Google"])
app.include_router(course_router, prefix="/api/v1/courses", tags=["Courses"])
@app.get("/")
def root():
    return {"message": "Drive System API is running"}