import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "purple" | "red" | "yellow";
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}: StatsCardProps) {
  const colorStyles = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
          <p className={`text-3xl font-bold ${colorStyles[color]}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="ml-4">{icon}</div>}
      </div>
    </div>
  );
}
