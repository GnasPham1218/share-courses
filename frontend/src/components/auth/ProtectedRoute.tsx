import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

interface Props {
  allowedRoles?: string[]; // Danh sách các role được phép truy cập
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const location = useLocation();

  // 1. Lấy thông tin xác thực
  const isAuth = authService.isAuthenticated(); // Kiểm tra có token không
  const userRole = authService.getUserRole(); // Lấy role hiện tại (admin/student/user)

  // 2. CHECK 1: Chưa đăng nhập
  // Nếu không có token hoặc không lấy được role -> Đá về trang Login
  if (!isAuth || !userRole) {
    // state={{ from: location }} giúp sau này login xong có thể redirect lại đúng trang đang xem dở
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. CHECK 2: Sai quyền (Role không nằm trong danh sách cho phép)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Nếu là Admin đi lạc vào trang Student -> Về Admin
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // Nếu là Student đi lạc vào trang Admin -> Về Client
    if (userRole === "student" || userRole === "user") {
      return <Navigate to="/client" replace />;
    }

    // Trường hợp role lạ -> Về login
    return <Navigate to="/login" replace />;
  }

  // 4. Hợp lệ -> Cho phép render các Route con (thông qua Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
