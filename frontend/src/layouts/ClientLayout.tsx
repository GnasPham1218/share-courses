import { Outlet, Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar cho Client */}
      <nav className="h-20 border-b flex items-center justify-between px-10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link
          to="/client"
          className="text-2xl font-black text-blue-600 tracking-tighter"
        >
          LEARN EVERYDAY WITH GNAS
        </Link>
        <div className="hidden md:flex space-x-8 font-medium text-gray-600">
          <Link to="/client" className="hover:text-blue-600 transition">
            Khóa học của tôi
          </Link>
          <Link to="/support" className="hover:text-blue-600 transition">
            Hỗ trợ
          </Link>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-md">
          Đăng xuất
        </button>
      </nav>

      {/* Nội dung khóa học */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
