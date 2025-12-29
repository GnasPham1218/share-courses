import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar (Fixed width 64 = 16rem = 256px) */}
      <Sidebar />

      {/* Main Wrapper - Đẩy margin left bằng chiều rộng Sidebar */}
      <div className="flex-1 flex flex-col ml-64 min-w-0 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
