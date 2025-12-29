import React from 'react';

// Định nghĩa các biến thể màu sắc
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string; // Để custom thêm margin nếu cần
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-50 text-green-700 border-green-200", // Dùng cho trạng thái "Active"
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200", // Dùng cho "Pending"
    danger: "bg-red-50 text-red-700 border-red-200",       // Dùng cho "Revoked"
    info: "bg-blue-50 text-blue-700 border-blue-200",      // Dùng cho vai trò "Editor"
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};