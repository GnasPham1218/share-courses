import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

// 1. Định nghĩa kiểu dữ liệu cho Token để tránh dùng 'any'
interface TokenPayload {
  email?: string;
  sub?: string;
  name?: string;
  role?: string;
  // thêm các trường khác nếu cần
}

export default function Header() {
  // 2. Sử dụng Lazy Initialization (truyền hàm vào useState)
  // Code trong hàm này chỉ chạy 1 lần duy nhất khi component được tạo
  const [email] = useState<string>(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return "Admin User"; // Giá trị mặc định nếu không có token

    try {
      // Truyền interface vào jwtDecode để có type safety
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.email || decoded.sub || "Admin User";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Nếu token lỗi, trả về mặc định
      return "Admin User";
    }
  });

  // Đã bỏ useEffect vì việc lấy dữ liệu đã được xử lý ngay trong useState rồi

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider hidden md:block">
          Hệ thống quản lý tài liệu
        </h2>
      </div>

      {/* Right side: User Info */}
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{email}</p>
          <div className="flex items-center justify-end gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        {/* Avatar Circle */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white ring-1 ring-gray-100">
          {email.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
