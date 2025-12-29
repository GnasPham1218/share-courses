import { useState, useEffect, useCallback, useRef } from "react";
import { driveService } from "../services/driveService";
import type { DashboardData, Course, GoogleAccount } from "../interfaces";

export const useDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [accounts, setAccounts] = useState<GoogleAccount[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. FIX: Dùng useRef để đánh dấu là đã gọi API rồi
  // Giúp chặn việc gọi 2 lần trong Strict Mode
  const isFetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data: DashboardData = await driveService.getDashboardData();
      if (data) {
        setAccounts(data.accounts || []);
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 2. Chỉ gọi fetchData nếu biến cờ (flag) đang là false
    if (!isFetchedRef.current) {
      isFetchedRef.current = true; // Đánh dấu đã gọi
      fetchData();
    }
  }, [fetchData]);

  // Các actions gọi API khác
  const actions = {
    // 1. Share
    share: async (courseId: string, email: string) => {
      // Lưu ý: Tôi đã XÓA try/catch và alert ở đây.
      // Lý do: Để lỗi ném ra ngoài (throw) cho Component (CourseManager) bắt lấy
      // và hiển thị bằng Toast đẹp hơn.
      await driveService.shareCourse(courseId, email);
      await fetchData(); // Refresh data sau khi share xong
    },

    // 2. Revoke
    revoke: async (logId: string) => {
      // Tương tự, để Component xử lý lỗi nếu cần
      await driveService.revokeAccess(logId);
      await fetchData(); // Refresh data
    },

    // 3. Login Google
    getAuthUrl: async () => {
      return await driveService.getAuthUrl();
    },
    createCourse: async (payload: {
      name: string;
      drive_folder_id: string;
      owner_account_id: string;
    }) => {
      await driveService.createCourse(payload);
      await fetchData(); // Tải lại danh sách sau khi thêm
    },
  };

  return { courses, accounts, loading, actions };
};
