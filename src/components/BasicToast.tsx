import * as React from "react";

interface ToastProps {
  message: string;
}

export const BasicToast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="inline-flex py-[0.625rem] px-[1.25rem] justify-center items-center bg-main-1 rounded-[1.25rem]">
      <div className="text-body3 text-gray-7">{message}</div>
    </div>
  );
};
