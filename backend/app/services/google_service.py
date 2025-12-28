import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from app.core.config import settings
from supabase import create_client

# Khởi tạo Supabase Client dùng chung
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


class GoogleDriveService:
    # Định nghĩa Scopes tập trung để dùng chung cho cả Login và Callback
    SCOPES = [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ]

    @staticmethod
    def get_flow():
        """Cấu hình luồng đăng nhập Google"""
        return google_auth_oauthlib.flow.Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=GoogleDriveService.SCOPES,  # Sử dụng biến chung ở đây
        )

    @staticmethod
    def get_drive_client(refresh_token: str):
        """Tạo client để làm việc với Drive từ refresh_token"""
        creds = Credentials(
            None,
            refresh_token=refresh_token,
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
            token_uri="https://oauth2.googleapis.com/token",
        )
        return build("drive", "v3", credentials=creds)

    @staticmethod
    def share_folder(account_id: str, folder_id: str, customer_email: str):
        # 1. Lấy refresh_token
        res = (
            supabase.table("google_accounts")
            .select("refresh_token")
            .eq("id", account_id)
            .single()
            .execute()
        )
        refresh_token = res.data["refresh_token"]

        service = GoogleDriveService.get_drive_client(refresh_token)

        # 2. Cấu hình quyền 'reader' (thay cho 'viewer' cũ)
        user_permission = {
            "type": "user",
            "role": "reader",
            "emailAddress": customer_email,
        }

        # 3. Thực thi việc Share
        # sendNotificationEmail=True sẽ gửi mail mời từ Google
        permission = (
            service.permissions()
            .create(
                fileId=folder_id,
                body=user_permission,
                fields="id",
                sendNotificationEmail=True,
            )
            .execute()
        )

        # 4. Chặn tải xuống/sao chép (Phần gây lỗi 400)
        # Bọc trong try-except để nếu không hỗ trợ cho Folder thì vẫn hoàn thành việc Share
        try:
            service.files().update(
                fileId=folder_id,
                body={"copyRequiresWriterPermission": True},
                fields="id",
            ).execute()
        except Exception as e:
            print(f"Lưu ý: Không thể thiết lập chặn tải xuống cho Folder này: {str(e)}")
            # Không raise lỗi ở đây để khách hàng vẫn nhận được quyền xem

        return permission["id"]

    @staticmethod
    def revoke_share(account_id: str, folder_id: str, permission_id: str):
        """Xóa quyền truy cập của khách hàng khỏi Folder"""
        # 1. Lấy token của chủ sở hữu
        res = (
            supabase.table("google_accounts")
            .select("refresh_token")
            .eq("id", account_id)
            .single()
            .execute()
        )
        refresh_token = res.data["refresh_token"]

        # 2. Khởi tạo service
        service = GoogleDriveService.get_drive_client(refresh_token)

        # 3. Gọi lệnh xóa quyền dựa trên permission_id đã lưu trong Log
        service.permissions().delete(
            fileId=folder_id, permissionId=permission_id
        ).execute()

        return True
