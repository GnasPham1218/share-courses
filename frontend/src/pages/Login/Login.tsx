import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const redirectByRole = () => {
    const role = authService.getUserRole();

    if (role === "admin") {
      // Nếu là Admin -> Vào trang quản trị
      window.location.href = "/admin";
    } else if (role === "student" || role === "user") {
      // Nếu là Student -> Vào trang Client
      window.location.href = "/client";
    } else {
      // Trường hợp lỗi hoặc không có role -> Về trang chủ hoặc báo lỗi
      alert("Tài khoản không xác định quyền hạn!");
      localStorage.removeItem("accessToken"); // Xóa token lỗi
    }
  };
  // 1. Logic bắt Token từ URL (sau khi Google redirect về)
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);

      // Xóa token trên thanh địa chỉ cho đẹp
      window.history.replaceState({}, document.title, window.location.pathname);

      // GỌI HÀM ĐIỀU HƯỚNG
      redirectByRole();
    }
  }, [searchParams]);

  // 2. Logic gọi API lấy link Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const authUrl = await authService.getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối server");
      setLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Vui lòng đăng nhập bằng Google.");
  };

  return (
    // Bỏ hết khung viền, shadow, bg-white vì AuthLayout đã lo rồi
    <div className="w-full">
      {/* Nút Google */}
      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full mb-6 py-2.5"
      >
        {loading ? (
          "Đang chuyển hướng..."
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5 mr-3"
              alt="Google"
            />
            Tiếp tục với Google
          </>
        )}
      </Button>

      {/* Đường kẻ phân cách */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Hoặc email</span>
        </div>
      </div>

      {/* Form đăng nhập (Placeholder) */}
      <form onSubmit={handleEmailLogin} className="space-y-5">
        <Input
          label="Email"
          placeholder="admin@example.com"
          type="email"
          disabled={loading}
        />

        <Input
          label="Mật khẩu"
          placeholder="••••••••"
          type="password"
          disabled={loading}
        />

        <div className="pt-2">
          <Button className="w-full justify-center py-2.5" disabled={loading}>
            Đăng nhập
          </Button>
        </div>
      </form>

      {/* Footer Links */}
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Chưa có tài khoản? </span>
        <a
          href="/register"
          className="text-blue-600 font-medium hover:underline"
          onClick={(e) => {
            e.preventDefault();
            handleGoogleLogin();
          }}
        >
          Đăng ký ngay
        </a>
      </div>
    </div>
  );
};

export default Login;
