import { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

export default function Alert({
  children,
  variant = "info",
  onClose,
}: AlertProps) {
  const variantStyles = {
    success: "bg-green-50 border-green-200 text-green-600",
    error: "bg-red-50 border-red-200 text-red-600",
    info: "bg-blue-50 border-blue-200 text-blue-600",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-600",
  };

  return (
    <div
      className={`p-3 border rounded-md flex items-start justify-between ${variantStyles[variant]}`}
    >
      <p className="text-sm flex-1">{children}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-current opacity-70 hover:opacity-100"
          aria-label="Close alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
