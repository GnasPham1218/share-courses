import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-2 italic">
          Share Khóa học
        </h1>
        <p className="text-gray-500">Learn Everyday with Gnas</p>
      </div>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
