from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.google_routes import router as google_router
from app.api.courses import router as course_router
from app.api.auth import router as auth_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép mọi nguồn (Frontend) gọi vào.
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các method: GET, POST, PUT, DELETE...
    allow_headers=["*"],  # Cho phép tất cả header
)


# Gắn các route vào app chính
app.include_router(google_router, prefix="/api/v1/google", tags=["Google"])
app.include_router(course_router, prefix="/api/v1/courses", tags=["Courses"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])


@app.get("/")
def root():
    return {"message": "Drive System API is running"}
