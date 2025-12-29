from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Khai báo các biến (Pydantic sẽ tự động convert viết hoa/thường từ .env)
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str # Callback cho Drive: .../api/v1/google/callback
    GOOGLE_REDIRECT_URI_LOGIN: str # Callback cho Auth: .../api/v1/auth/callback
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    FRONTEND_URL: str = "http://localhost:5173"

    # Cách khai báo chuẩn cho Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # Bỏ qua nếu trong .env có thừa biến khác
    )


settings = Settings()
