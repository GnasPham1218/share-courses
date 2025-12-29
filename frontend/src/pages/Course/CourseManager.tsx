import { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { useToast } from "../../hooks/useToast";
import { CourseRow } from "../../components/features/Course/CourseRow";
import { AddCourseModal } from "../../components/features/Course/AddCourseModal"; // Import mới
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Table, Thead, Tbody, Th } from "../../components/ui/Table";

const CourseManager = () => {
  const { courses, accounts, loading, actions } = useDashboard();
  const toast = useToast();

  // -- State Modal Share --
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [isSubmittingShare, setIsSubmittingShare] = useState(false);

  // -- State Modal Add Course --
  // Chỉ cần duy nhất 1 dòng state này cho tính năng thêm mới
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // --- Logic Share (Giữ nguyên) ---
  const handleOpenShare = (courseId: string) => {
    setSelectedCourseId(courseId);
    setShareModalOpen(true);
  };

  const handleSubmitShare = async () => {
    if (!selectedCourseId || !shareEmail.trim()) {
      toast.warning("Vui lòng nhập email.");
      return;
    }
    const currentCourse = courses.find((c) => c.id === selectedCourseId);
    if (
      currentCourse?.access_logs?.some(
        (log) =>
          log.customer_email.toLowerCase() === shareEmail.trim().toLowerCase()
      )
    ) {
      toast.error("Email này đã được cấp quyền rồi!");
      return;
    }

    setIsSubmittingShare(true);
    try {
      await actions.share(selectedCourseId, shareEmail);
      toast.success("Đã cấp quyền thành công!");
      setShareModalOpen(false);
      setShareEmail("");
    } catch (error) {
      toast.error("Lỗi khi cấp quyền.");
    } finally {
      setIsSubmittingShare(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Danh sách Khóa học
          </h1>
          <p className="text-gray-500 text-sm">
            Quản lý và phân quyền truy cập folder
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>+ Thêm khóa học</Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Tên khóa học</Th>
              <Th>Folder ID</Th>
              <Th>Chủ sở hữu</Th>
              <Th className="text-right">Thao tác</Th>
            </tr>
          </Thead>
          <Tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  onShare={() => handleOpenShare(course.id)}
                  onRevoke={actions.revoke}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  Trống
                </td>
              </tr>
            )}
          </Tbody>
        </Table>
      )}

      {/* --- Component Form Thêm Mới (Đã tách riêng) --- */}
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        accounts={accounts}
        onCreate={actions.createCourse}
      />

      {/* --- Modal Share (Vẫn giữ ở đây hoặc tách tiếp nếu muốn) --- */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => !isSubmittingShare && setShareModalOpen(false)}
        title="Cấp quyền truy cập"
        width="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Email người học"
            placeholder="student@gmail.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            disabled={isSubmittingShare}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShareModalOpen(false)}
              disabled={isSubmittingShare}
            >
              Hủy
            </Button>
            <Button onClick={handleSubmitShare} disabled={isSubmittingShare}>
              {isSubmittingShare ? "Xử lý..." : "Cấp quyền"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseManager;
