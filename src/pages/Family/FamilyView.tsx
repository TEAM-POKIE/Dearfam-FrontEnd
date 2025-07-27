import * as React from "react";
import { BellRing, Check } from "lucide-react";

interface Notification {
  title: string;
  description: string;
}

interface FamilyViewProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  notifications,
  onMarkAllAsRead,
}) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">가족</h1>
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">알림</h2>
          <p className="text-sm text-gray-500">
            읽지 않은 메시지가 {notifications.length}개 있습니다.
          </p>
        </div>

        <div className="p-6 grid gap-4">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">푸시 알림</p>
              <p className="text-sm text-gray-500">기기로 알림을 보냅니다.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={true}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#F5751E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <span className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform translate-x-5" />
            </button>
          </div>

          <div>
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            className="w-full inline-flex items-center justify-center rounded-md bg-[#F5751E] px-4 py-2 text-sm font-medium text-white hover:bg-[#E56A1B] focus:outline-none focus:ring-2 focus:ring-[#F5751E] focus:ring-offset-2"
            onClick={onMarkAllAsRead}
          >
            <Check className="mr-2 h-4 w-4" /> 모두 읽음으로 표시
          </button>
        </div>
      </div>
    </div>
  );
};
