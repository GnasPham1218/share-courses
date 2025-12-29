import React from 'react';

// 1. Container chính của bảng
export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm ${className}`}>
    <table className="w-full text-left text-sm border-collapse">
      {children}
    </table>
  </div>
);

// 2. Phần đầu bảng (Header)
export const Thead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50 border-b border-gray-200">
    {children}
  </thead>
);

// 3. Phần thân bảng (Body)
export const Tbody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-gray-100 bg-white">
    {children}
  </tbody>
);

// 4. Dòng (Row)
export const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className, ...props }) => (
  <tr className={`transition-colors hover:bg-gray-50/50 ${className}`} {...props}>
    {children}
  </tr>
);

// 5. Ô tiêu đề (Header Cell)
export const Th: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <th className={`px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider text-xs ${className}`}>
    {children}
  </th>
);

// 6. Ô dữ liệu (Data Cell)
export const Td: React.FC<{ children: React.ReactNode; className?: string; colSpan?: number }> = ({ children, className, colSpan }) => (
  <td colSpan={colSpan} className={`px-4 py-3 text-gray-700 align-middle ${className}`}>
    {children}
  </td>
);