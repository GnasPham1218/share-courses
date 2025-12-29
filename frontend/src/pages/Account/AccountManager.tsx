import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";
import { useToast } from "../../hooks/useToast";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, Thead, Tbody, Th, Tr, Td } from "../../components/ui/Table";

const AccountManager = () => {
  const { accounts, loading, actions } = useDashboard();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const toastShownRef = useRef(false);

  useEffect(() => {
    const status = searchParams.get("status");
    const error = searchParams.get("error");

    if (status === "success" && !toastShownRef.current) {
      toastShownRef.current = true;
      setTimeout(() => {
        toast.success("Kết nối tài khoản Google thành công!");
        setSearchParams({});
      }, 0);
    }

    if (error && !toastShownRef.current) {
      toastShownRef.current = true;
      setTimeout(() => {
        toast.error(`Lỗi kết nối: ${error}`);
        setSearchParams({});
      }, 0);
    }

    if (!status && !error) {
      toastShownRef.current = false;
    }
  }, [searchParams, setSearchParams, toast]);

  const handleConnectGoogle = async () => {
    try {
      const authUrl = await actions.getAuthUrl();
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error("Không tìm thấy đường dẫn đăng nhập.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối đến server backend.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tài khoản Google</h1>
          <p className="text-gray-500 text-sm">
            Danh sách tài khoản dùng để lưu trữ bài học
          </p>
        </div>

        <Button
          onClick={handleConnectGoogle}
          disabled={loading}
          className="bg-blue-600 border border-transparent text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            "Đang xử lý..."
          ) : (
            <>
              <span className="mr-2 font-bold">G</span> Kết nối Gmail mới
            </>
          )}
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <Thead>
            <tr>
              <Th>Email</Th>
              <Th>Trạng thái</Th>
              <Th>Ngày kết nối</Th>
              {/* Đã bỏ cột Hành động */}
            </tr>
          </Thead>
          <Tbody>
            {accounts.length > 0 ? (
              accounts.map((acc) => (
                <Tr key={acc.id}>
                  <Td className="font-medium text-gray-900">{acc.email}</Td>
                  <Td>
                    <Badge variant="success">Đang hoạt động</Badge>
                  </Td>
                  <Td className="text-gray-500">
                    {new Date(acc.created_at).toLocaleDateString("vi-VN")}
                  </Td>
                  {/* Đã bỏ nút Ngắt kết nối */}
                </Tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3} // Sửa từ 4 thành 3 cho khớp số cột
                  className="p-8 text-center text-gray-400 italic"
                >
                  Chưa có tài khoản nào.
                </td>
              </tr>
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default AccountManager;
