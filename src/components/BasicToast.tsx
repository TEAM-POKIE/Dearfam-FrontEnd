import * as React from "react";
import { applyMotionAI } from "@/utils/motion-ai-animations";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

export const BasicToast: React.FC<ToastProps> = ({
  message,
  type = "success",
  duration = 3000,
}) => {
  const getToastStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      default:
        return "bg-main-1 text-gray-7";
    }
  };

  return (
    <div
      className={`inline-flex py-[0.625rem] px-[1.25rem] justify-center items-center rounded-[1.25rem] shadow-lg backdrop-blur-sm ${getToastStyle()}`}
      style={applyMotionAI.bounce("fast")}
    >
      <div className="text-body3 font-medium">{message}</div>
    </div>
  );
};

export default BasicToast;
