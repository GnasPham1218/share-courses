// src/services/driveService.ts
import apiClient from "../api/clients";
import type { CourseCreatePayload, DashboardData } from "../interfaces";

export const driveService = {
  // ------------------------------------------------
  // NHÓM 1: AUTHENTICATION (Google Router)
  // Prefix: /api/v1/google
  // ------------------------------------------------

  /**
   * 1. Lấy URL đăng nhập Google
   * Cũ: /login -> Mới: /api/v1/google/login
   */
  getAuthUrl: async (): Promise<string> => {
    const response = await apiClient.get("/api/v1/google/login");
    return response.data.url;
  },

  /**
   * 2. Gửi mã code xác thực sau khi Google redirect về
   * Cũ: /callback -> Mới: /api/v1/google/callback
   */
  handleAuthCallback: async (code: string) => {
    const response = await apiClient.get("/api/v1/google/callback", {
      params: { code },
    });
    return response.data;
  },

  // ------------------------------------------------
  // NHÓM 2: QUẢN LÝ DỮ LIỆU & DASHBOARD (Course Router)
  // Prefix: /api/v1/courses
  // ------------------------------------------------

  /**
   * 3. Lấy dữ liệu Dashboard
   * Cũ: /dashboard-data -> Mới: /api/v1/courses/dashboard-data
   */
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await apiClient.get("/api/v1/courses/dashboard-data");
    return response.data;
  },

  /**
   * 4. Lấy danh sách khóa học
   * Cũ: /list -> Mới: /api/v1/courses/list
   */
  getCourses: async () => {
    const response = await apiClient.get("/api/v1/courses/list");
    return response.data;
  },

  /**
   * 5. Tạo khóa học mới
   * Cũ: /add -> Mới: /api/v1/courses/add
   */
  createCourse: async (payload: CourseCreatePayload) => {
    const response = await apiClient.post("/api/v1/courses/add", payload);
    return response.data;
  },

  /**
   * 6. Chia sẻ khóa học
   * Cũ: /share -> Mới: /api/v1/courses/share
   */
  shareCourse: async (courseId: string, customerEmail: string) => {
    const response = await apiClient.post("/api/v1/courses/share", null, {
      params: {
        course_id: courseId,
        customer_email: customerEmail,
      },
    });
    return response.data;
  },

  /**
   * 7. Thu hồi quyền truy cập
   * Cũ: /revoke/{id} -> Mới: /api/v1/courses/revoke/{id}
   */
  revokeAccess: async (logId: string) => {
    const response = await apiClient.delete(`/api/v1/courses/revoke/${logId}`);
    return response.data;
  },
};
