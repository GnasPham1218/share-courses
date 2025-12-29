# app/api/auth.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from app.services.google_service import (
    GoogleDriveService,
    supabase,
)  # Tận dụng service cũ
from app.core.config import settings
import requests
import jwt  # Cần cài: pip install pyjwt
from datetime import datetime, timedelta

router = APIRouter()


# 1. API chuyển hướng sang Google Login
@router.get("/login")
def login_google():
    # Sử dụng flow riêng hoặc cấu hình scope chỉ cần lấy profile email
    # Scope này NHẸ hơn scope drive
    SCOPES = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
    ]

    flow = GoogleDriveService.get_flow(scopes=SCOPES)
    flow.redirect_uri = (
        settings.GOOGLE_REDIRECT_URI_LOGIN
    )  # Cần set 1 đường dẫn callback khác, ví dụ: .../auth/callback

    auth_url, _ = flow.authorization_url(prompt="select_account")
    return {"url": auth_url}


ADMIN_EMAILS = ["sp186913@gmail.com"]


# 2. Callback xử lý đăng nhập/đăng ký
@router.get("/callback")
async def auth_callback(code: str):
    try:
        # --- A. Lấy Token từ Google ---
        flow = GoogleDriveService.get_flow()
        flow.redirect_uri = settings.GOOGLE_REDIRECT_URI_LOGIN
        flow.fetch_token(code=code)
        creds = flow.credentials

        # --- B. Lấy thông tin User từ Google ---
        user_info = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {creds.token}"},
        ).json()

        email = user_info.get("email")
        google_id = user_info.get("sub")
        full_name = user_info.get("name")
        avatar = user_info.get("picture")

        # --- LOGIC XÁC ĐỊNH ROLE (QUAN TRỌNG) ---
        # 1. Mặc định là student
        determined_role = "student"

        # 2. Nếu email nằm trong danh sách VIP -> set là admin
        if email in ADMIN_EMAILS:
            determined_role = "admin"

        # --- C. Lưu hoặc Cập nhật vào bảng USERS ---
        # Kiểm tra user có tồn tại chưa
        existing_user = supabase.table("users").select("*").eq("email", email).execute()

        user_data = {
            "email": email,
            "google_id": google_id,
            "full_name": full_name,
            "avatar_url": avatar,
            "last_login": datetime.utcnow().isoformat(),
        }

        # Biến để lưu role cuối cùng dùng cho Token
        final_role = determined_role
        user_id = None

        if existing_user.data:
            # --- TRƯỜNG HỢP: ĐĂNG NHẬP (UPDATE) ---
            user_record = existing_user.data[0]
            user_id = user_record["id"]
            current_db_role = user_record["role"]

            # Logic thăng cấp:
            # Nếu trong DB đang là 'student' NHƯNG email lại có trong danh sách Admin -> Update lên Admin
            if determined_role == "admin" and current_db_role != "admin":
                final_role = "admin"
                user_data["role"] = "admin"  # Cập nhật vào DB
            else:
                # Nếu không có gì đặc biệt, giữ nguyên role đang có trong DB
                final_role = current_db_role

            # Thực hiện update
            supabase.table("users").update(user_data).eq("id", user_id).execute()

        else:
            # --- TRƯỜNG HỢP: ĐĂNG KÝ MỚI (INSERT) ---
            # Sử dụng role đã tính toán ở trên (admin nếu trong list, student nếu không)
            user_data["role"] = determined_role

            new_user = supabase.table("users").insert(user_data).execute()
            user_id = new_user.data[0]["id"]
            final_role = determined_role

        # --- D. Tạo JWT Token ---
        token_payload = {
            "sub": user_id,
            "email": email,
            "role": final_role,  # Dùng role chuẩn đã xử lý
            "exp": datetime.utcnow() + timedelta(days=7),
        }

        access_token = jwt.encode(
            token_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM
        )

        # --- E. Redirect về Frontend kèm Token ---
        redirect_url = f"{settings.FRONTEND_URL}/login?token={access_token}"

        return RedirectResponse(url=redirect_url)

    except Exception as e:
        # In lỗi ra console server để dễ debug
        print(f"Lỗi Auth Callback: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
