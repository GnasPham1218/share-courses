import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import CourseManager from "./pages/Course/CourseManager";
import AccountManager from "./pages/Account/AccountManager";
import { ToastProvider } from "./context/ToastProvider";

// Import thêm các thành phần bảo mật

import { authService } from "./services/authService";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// --- 1. Component tự động điều hướng ở trang chủ ---
// Nếu đã login -> vào dashboard tương ứng. Chưa login -> vào login.
const RootRedirect = () => {
  const role = authService.getUserRole();
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "student" || role === "user")
    return <Navigate to="/client" replace />;
  return <Navigate to="/login" replace />;
};

// --- 2. Component chặn user đã đăng nhập vào lại trang Login ---
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const role = authService.getUserRole();
  if (role) {
    // Đã có role (đã login) thì đá về trang tương ứng, không cho xem Login nữa
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/client" replace />;
  }
  return children;
};

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. TRANG CHỦ: Điều hướng thông minh */}
          <Route path="/" element={<RootRedirect />} />

          {/* 2. NHÓM AUTH: Chỉ cho người CHƯA đăng nhập vào */}
          <Route element={<AuthLayout />}>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <div>Form đăng ký tại đây</div>
                </PublicOnlyRoute>
              }
            />
          </Route>

          {/* 3. NHÓM ADMIN: Phải đăng nhập & Role = admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="accounts" element={<AccountManager />} />
              <Route path="courses" element={<CourseManager />} />
            </Route>
          </Route>

          {/* 4. NHÓM CLIENT: Phải đăng nhập & Role = student (hoặc admin cũng được xem) */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["student", "user", "admin"]} />
            }
          >
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<div>Danh sách khóa học của tôi</div>} />
              <Route path="course/:id" element={<div>Học bài online</div>} />
            </Route>
          </Route>

          {/* Route 404: Xử lý khi nhập linh tinh */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">404 - Trang không tồn tại</div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
