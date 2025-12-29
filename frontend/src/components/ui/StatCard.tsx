import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string; // Class màu background cho icon (vd: bg-blue-100 text-blue-600)
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "bg-blue-50 text-blue-600",
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
};
