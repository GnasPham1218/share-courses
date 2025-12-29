import { useDashboard } from "../../hooks/useDashboard";
import { StatCard } from "../../components/ui/StatCard";
import { Table, Thead, Tbody, Th, Tr, Td } from "../../components/ui/Table";

const Dashboard = () => {
  const { courses, accounts, loading } = useDashboard();

  // Tính toán số liệu giả lập (hoặc lấy từ API nếu có)
  const totalCourses = courses.length;
  const totalAccounts = accounts.length;
  const totalStudents = courses.reduce(
    (acc, curr) => acc + (curr.access_logs?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>

      {/* 1. Phần Thống kê (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng Khóa học"
          value={loading ? "..." : totalCourses}
          icon={
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Tài khoản Google Drive"
          value={loading ? "..." : totalAccounts}
          icon={
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
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          }
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Học viên đang Active"
          value={loading ? "..." : totalStudents}
          icon={
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* 2. Phần hoạt động gần đây (Ví dụ đơn giản) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Hoạt động gần đây
        </h2>
        <Table>
          <Thead>
            <tr>
              <Th>Thời gian</Th>
              <Th>Hành động</Th>
              <Th>Chi tiết</Th>
            </tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <span className="text-gray-500">Vừa xong</span>
              </Td>
              <Td>
                <span className="font-medium text-blue-600">Đồng bộ</span>
              </Td>
              <Td>Hệ thống vừa tải lại dữ liệu từ Google Drive</Td>
            </Tr>
            {/* Bạn có thể map logs thật vào đây */}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
