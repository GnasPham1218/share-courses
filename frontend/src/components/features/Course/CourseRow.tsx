import React, { useState } from "react";
import type { Course } from "../../../interfaces";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { Tr, Td } from "../../ui/Table";
import { Modal } from "../../ui/Modal"; // 1. Import Modal
import { useToast } from "../../../hooks/useToast"; // 2. Import Toast

interface Props {
  course: Course;
  onShare: () => void;
  // Cập nhật kiểu trả về là Promise để có thể await khi loading
  onRevoke: (id: string) => Promise<void> | void;
}

export const CourseRow: React.FC<Props> = ({ course, onShare, onRevoke }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // -- State cho Modal Xóa --
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // -- Hook Toast --
  const toast = useToast();

  // Hàm mở Modal xác nhận
  const handleOpenRevokeModal = (logId: string) => {
    setSelectedLogId(logId);
    setIsRevokeModalOpen(true);
  };

  // Hàm thực hiện hành động xóa (khi bấm Đồng ý trong Modal)
  const handleConfirmRevoke = async () => {
    if (!selectedLogId) return;

    setIsRevoking(true);
    try {
      // Gọi hàm từ props (được truyền từ parent)
      await onRevoke(selectedLogId);

      // Hiện thông báo thành công
      toast.success("Đã thu hồi quyền truy cập thành công!");

      // Đóng modal và reset
      setIsRevokeModalOpen(false);
      setSelectedLogId(null);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thu hồi quyền. Vui lòng thử lại.");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <>
      <Tr className={isExpanded ? "bg-blue-50/30" : ""}>
        <Td>
          <span className="font-medium text-gray-900">{course.name}</span>
        </Td>
        <Td>
          <Badge variant="info">{course.drive_folder_id}</Badge>
        </Td>
        <Td>{course.google_accounts?.email}</Td>
        <Td className="text-right flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded
              ? "Ẩn Logs"
              : `Xem Logs (${course.access_logs?.length || 0})`}
          </Button>
          <Button variant="primary" onClick={onShare} className="text-xs px-3">
            + Share
          </Button>
        </Td>
      </Tr>

      {/* Expanded Row */}
      {isExpanded && (
        <Tr className="bg-gray-50 hover:bg-gray-50">
          <Td colSpan={4} className="p-0">
            <div className="p-4 pl-12 border-l-4 border-blue-500">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                Danh sách học viên đã cấp quyền
              </h4>

              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {course.access_logs?.length === 0 ? (
                      <tr>
                        <td className="p-4 text-center text-gray-400 italic">
                          Chưa có học viên nào
                        </td>
                      </tr>
                    ) : (
                      course.access_logs?.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b last:border-0 border-gray-100"
                        >
                          <td className="px-4 py-2">{log.customer_email}</td>
                          <td className="px-4 py-2 text-right">
                            <Badge
                              variant={log.permission_id ? "success" : "danger"}
                            >
                              {log.permission_id ? "Active" : "Error"}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <span
                              // Thay đổi: Gọi hàm mở Modal thay vì gọi onRevoke trực tiếp
                              onClick={() => handleOpenRevokeModal(log.id)}
                              className="text-red-600 hover:text-red-800 cursor-pointer text-xs font-medium hover:underline"
                            >
                              Thu hồi
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Td>
        </Tr>
      )}

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      <Modal
        isOpen={isRevokeModalOpen}
        onClose={() => {
          if (!isRevoking) setIsRevokeModalOpen(false);
        }}
        title="Xác nhận thu hồi quyền"
        width="max-w-sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn xóa quyền truy cập của học viên này không?
            Hành động này sẽ xóa quyền trên Google Drive ngay lập tức.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsRevokeModalOpen(false)}
              disabled={isRevoking}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmRevoke}
              disabled={isRevoking}
            >
              {isRevoking ? "Đang xử lý..." : "Đồng ý xóa"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
