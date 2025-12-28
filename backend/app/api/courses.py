from fastapi import APIRouter, HTTPException
from app.services.google_service import GoogleDriveService, supabase
from pydantic import BaseModel

router = APIRouter()


class CourseCreate(BaseModel):
    name: str
    drive_folder_id: str
    owner_account_id: str  # Dán cái UUID vừa copy từ Supabase vào đây khi gọi API


@router.post("/add")
async def add_course(course: CourseCreate):
    try:
        data = {
            "name": course.name,
            "drive_folder_id": course.drive_folder_id,
            "owner_account_id": course.owner_account_id,
        }
        result = supabase.table("courses").insert(data).execute()
        return {"message": "Đã thêm khóa học thành công", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/list")
async def get_all_courses():
    # Lấy danh sách khóa học kèm theo email của chủ sở hữu
    result = supabase.table("courses").select("*, google_accounts(email)").execute()
    return result.data


@router.post("/share")
async def share_to_customer(course_id: str, customer_email: str):
    try:
        # 1. Lấy thông tin khóa học từ DB
        course = (
            supabase.table("courses").select("*").eq("id", course_id).single().execute()
        )
        if not course.data:
            raise HTTPException(status_code=404, detail="Không tìm thấy khóa học")

        folder_id = course.data["drive_folder_id"]
        owner_id = course.data["owner_account_id"]

        # 2. Gọi service để share trên Google Drive
        perm_id = GoogleDriveService.share_folder(owner_id, folder_id, customer_email)

        # 3. Lưu lịch sử vào bảng access_logs
        supabase.table("access_logs").insert(
            {
                "customer_email": customer_email,
                "course_id": course_id,
                "permission_id": perm_id,
            }
        ).execute()

        return {"status": "success", "message": f"Đã chia sẻ cho {customer_email}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi khi share: {str(e)}")


@router.delete("/revoke/{log_id}")
async def revoke_access(log_id: str):
    try:
        # 1. Tìm thông tin trong nhật ký (access_logs)
        log = (
            supabase.table("access_logs")
            .select("*, courses(*)")
            .eq("id", log_id)
            .single()
            .execute()
        )
        if not log.data:
            raise HTTPException(
                status_code=404, detail="Không tìm thấy nhật ký truy cập"
            )

        folder_id = log.data["courses"]["drive_folder_id"]
        owner_id = log.data["courses"]["owner_account_id"]
        permission_id = log.data["permission_id"]

        # 2. Gọi service để xóa quyền trên Google Drive
        GoogleDriveService.revoke_share(owner_id, folder_id, permission_id)

        # 3. Xóa nhật ký trong DB hoặc đánh dấu là đã thu hồi
        supabase.table("access_logs").delete().eq("id", log_id).execute()

        return {"status": "success", "message": "Đã thu hồi quyền truy cập thành công"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi khi thu hồi: {str(e)}")
@router.get("/dashboard-data")
async def get_dashboard_data():
    # 1. Lấy danh sách account
    accounts = supabase.table("google_accounts").select("*").execute()
    
    # 2. Lấy danh sách khóa học kèm log khách hàng
    courses = supabase.table("courses").select("*, access_logs(*)").execute()
    
    return {
        "accounts": accounts.data,
        "courses": courses.data
    }