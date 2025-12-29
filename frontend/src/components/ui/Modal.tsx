import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) => {
  // Xóa bỏ phần setMounted gây lỗi vì không cần thiết ở React thuần (SPA)

  // Xử lý khóa cuộn trang (Body Scroll Lock) và phím ESC
  useEffect(() => {
    if (isOpen) {
      // 1. Khóa cuộn trang khi Modal mở
      document.body.style.overflow = "hidden";

      // 2. Lắng nghe phím ESC để đóng
      const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", handleEsc);

      // 3. Dọn dẹp khi đóng Modal (Cleanup function)
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  // Kiểm tra an toàn: Nếu không có isOpen hoặc không tìm thấy document (môi trường Test) thì không render
  if (!isOpen || typeof document === "undefined") return null;

  // Render Portal trực tiếp ra body
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay: Lớp nền mờ tối */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Content: Nội dung Modal */}
      <div
        className={`
          relative w-full ${width} bg-white rounded-xl shadow-2xl 
          transform transition-all animate-in zoom-in-95 duration-200
          flex flex-col max-h-[90vh]
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 leading-6">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
            type="button"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};
