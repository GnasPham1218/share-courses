# app/models/course.py
from pydantic import BaseModel, EmailStr

class CourseCreate(BaseModel):
    course_name: str
    drive_folder_id: str
    owner_account_id: str # ID của tài khoản Google lưu trong Supabase

class ShareRequest(BaseModel):
    customer_email: EmailStr
    course_id: str