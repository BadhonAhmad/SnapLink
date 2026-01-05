import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "small" | "medium" | "large";
}

export default function Card({
  children,
  className = "",
  padding = "medium",
}: CardProps) {
  const paddingStyles = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
