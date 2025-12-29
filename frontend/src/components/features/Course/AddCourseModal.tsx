// src/components/features/Course/AddCourseModal.tsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";
import { Modal } from "../../ui/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import type { GoogleAccount } from "../../../interfaces";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  accounts: GoogleAccount[]; // Nhận danh sách tài khoản từ cha
  onCreate: (payload: {
    name: string;
    drive_folder_id: string;
    owner_account_id: string;
  }) => Promise<void>;
}

export const AddCourseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  accounts,
  onCreate,
}) => {
  const toast = useToast();

  // State quản lý form
  const [name, setName] = useState("");
  const [folderInput, setFolderInput] = useState("");
  const [folderId, setFolderId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setName("");
      setFolderInput("");
      setFolderId("");
      setOwnerId("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Logic tách ID từ URL
  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFolderInput(val);

    const match = val.match(/\/folders\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      setFolderId(match[1]);
    } else {
      setFolderId(val);
    }
  };

  // Logic Submit
  const handleSubmit = async () => {
    if (!name || !folderId || !ownerId) {
      toast.warning("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({
        name: name,
        drive_folder_id: folderId,
        owner_account_id: ownerId,
      });
      toast.success("Thêm khóa học thành công!");
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm khóa học (Kiểm tra Folder ID/Quyền).");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isSubmitting && onClose()}
      title="Thêm khóa học mới"
      width="max-w-lg"
    >
      <div className="space-y-5 pt-2">
        {/* 1. Tên khóa học */}
        <Input
          label="Tên khóa học"
          placeholder="Ví dụ: Khóa học React Master"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />

        {/* 2. Link Drive */}
        <div>
          <Input
            label="Google Drive Link (hoặc ID)"
            placeholder="Paste link folder vào đây..."
            value={folderInput}
            onChange={handleFolderInputChange}
            disabled={isSubmitting}
          />
          {folderId && folderId !== folderInput && (
            <p className="text-xs text-green-600 mt-1 ml-1 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Đã lấy ID:{" "}
              <span className="font-mono font-bold ml-1">{folderId}</span>
            </p>
          )}
        </div>

        {/* 3. Chọn Owner */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Tài khoản sở hữu (Owner)
          </label>
          <select
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="">-- Chọn tài khoản --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.email}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            Đây là tài khoản đã tạo folder trên Drive.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
