from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Khai báo các biến (Pydantic sẽ tự động convert viết hoa/thường từ .env)
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    SECRET_KEY: str

    # Cách khai báo chuẩn cho Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # Bỏ qua nếu trong .env có thừa biến khác
    )


settings = Settings()
