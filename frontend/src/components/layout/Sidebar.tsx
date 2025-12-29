import { Link, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import  { useState } from "react";
import { Modal } from "../ui/Modal";
export default function Sidebar() {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };
  const handleConfirmLogout = () => {
    authService.logout();
    setIsLogoutModalOpen(false);
  };

  // Hàm kiểm tra active (để tô màu menu đang chọn)
  const isActive = (path: string) => {
    // So sánh chính xác hoặc so sánh path cha
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Class chung cho các item
  const getItemClass = (path: string) =>
    `flex items-center px-4 py-3 mb-1 rounded-lg transition-colors duration-200 group ${
      isActive(path)
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <>
      <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-20">
        {/* --- LOGO --- */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white">
            Learn <span className="text-blue-500">Everyday</span>
          </span>
        </div>

        {/* --- MENU --- */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <Link to="/admin" className={getItemClass("/admin")}>
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          {/* Google Accounts */}
          <Link
            to="/admin/accounts"
            className={getItemClass("/admin/accounts")}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="font-medium">Tài khoản Google</span>
          </Link>

          {/* Courses */}
          <Link to="/admin/courses" className={getItemClass("/admin/courses")}>
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="font-medium">Quản lý Khóa học</span>
          </Link>
        </nav>

        {/* --- FOOTER (LOGOUT) --- */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleOpenLogoutModal}
            className="flex items-center w-full px-4 py-2 text-red-400 rounded-lg hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Xác nhận đăng xuất"
        width="max-w-sm" // Dùng modal nhỏ cho đẹp
      >
        <div className="pt-2">
          <p className="text-gray-600 mb-6">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors shadow-sm"
            >
              Đăng xuất ngay
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
