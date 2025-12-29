// src/interfaces/index.ts

// Định nghĩa log chia sẻ quyền
export interface AccessLog {
  id: string;
  customer_email: string;
  course_id: string;
  permission_id: string;
  shared_at: string;
}

// Định nghĩa tài khoản Google (Giáo viên)
export interface GoogleAccount {
  id: string;
  email: string;
  refresh_token?: string;
  created_at: string;
}

// Định nghĩa Khóa học
export interface Course {
  id: string;
  name: string;
  drive_folder_id: string;
  owner_account_id: string;
  created_at: string;
  // Các trường được join từ bảng khác
  google_accounts?: {
    email: string;
  };
  access_logs?: AccessLog[];
}

// Dữ liệu dashboard tổng hợp trả về từ API /dashboard-data
export interface DashboardData {
  accounts: GoogleAccount[];
  courses: Course[];
}

// Dữ liệu payload khi tạo khóa học mới
export interface CourseCreatePayload {
  name: string;
  drive_folder_id: string;
  owner_account_id: string;
}
