import * as React from "react";

interface BasicAlertProps {
  message: string;
}

export function BasicAlert({ message }: BasicAlertProps) {
  return (
    <div
      className={`
        text-body3
        text-alert
      `}
    >
      {message}
    </div>
  );
}
