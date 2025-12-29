import os
import requests  # Thêm thư viện này (pip install requests)
from fastapi import APIRouter, Request, HTTPException
from app.services.google_service import GoogleDriveService, supabase
from app.core.config import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi.responses import RedirectResponse

# Cấu hình cho môi trường Local
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"

router = APIRouter()


@router.get("/login")
def get_auth_url():
    flow = GoogleDriveService.get_flow()
    flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        include_granted_scopes="true",
    )
    return {"url": auth_url}


@router.get("/callback")
async def auth_callback(code: str):
    try:
        flow = GoogleDriveService.get_flow()
        flow.redirect_uri = settings.GOOGLE_REDIRECT_URI

        # 1. Đổi mã code lấy bộ Token
        flow.fetch_token(code=code)
        creds = flow.credentials

        # 2. LẤY EMAIL BẰNG CÁCH GỌI GOOGLE USERINFO API (Chắc chắn nhất)
        # Thay vì dựa vào id_token, ta gọi trực tiếp endpoint của Google bằng access_token
        userinfo_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {creds.token}"},
        )
        user_info = userinfo_response.json()
        user_email = user_info.get("email")

        if not user_email:
            return {"error": "Không thể lấy thông tin email từ Google UserInfo API."}

        # 3. Chuẩn bị dữ liệu cho Supabase
        # Lưu ý: refresh_token chỉ xuất hiện ở lần đầu hoặc khi có prompt=consent
        account_data = {
            "email": user_email,
        }

        if creds.refresh_token:
            account_data["refresh_token"] = creds.refresh_token

        # 4. Lưu vào Supabase
        # .upsert() sẽ cập nhật nếu email đã tồn tại, hoặc thêm mới nếu chưa có
        result = (
            supabase.table("google_accounts")
            .upsert(account_data, on_conflict="email")
            .execute()
        )

        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/admin/accounts?status=success"
        )

    except Exception as e:
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/admin/accounts?error={str(e)}"
        )
