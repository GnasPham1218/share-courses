// src/services/authService.ts
import apiClient from "../api/clients";
import { jwtDecode } from "jwt-decode";
interface TokenPayload {
  sub: string;
  email: string;
  role: string; // Quan trọng nhất là cái này
  exp: number;
}
export const authService = {
  // ------------------------------------------------
  // NHÓM: AUTHENTICATION (User System)
  // Prefix: /api/v1/auth
  // ------------------------------------------------

  /**
   * 1. Lấy URL đăng nhập Google cho User (Admin/Học viên)
   * API: GET /api/v1/auth/login
   */
  getGoogleAuthUrl: async (): Promise<string> => {
    const response = await apiClient.get("/api/v1/auth/login");
    // Backend trả về: { "url": "https://accounts.google.com/..." }
    return response.data.url;
  },

  /**
   * 2. (Optional) Hàm logout - Xóa token ở client
   * Lưu ý: Đây là xử lý phía client, nếu cần blacklist token thì gọi thêm API
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  },

  /**
   * 3. Kiểm tra xem user đã đăng nhập chưa
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
  /**
   * 4. Giải mã Token để lấy Role của User
   */
  getUserRole: (): string | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.role; // Trả về 'admin' hoặc 'student'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  },
  /**
   * Helper: Lấy đường dẫn mặc định dựa trên Role
   */
  getDefaultRedirect: (): string => {
    const role = authService.getUserRole();
    if (role === "admin") return "/admin";
    if (role === "student" || role === "user") return "/client";
    return "/login"; // Mặc định nếu không có role hoặc lỗi
  },
};
