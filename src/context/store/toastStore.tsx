import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";

interface ToastState {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const useToastStore = create<ToastState>()(
  devtools(
    () => ({
      showToast: (
        message: string,
        type: "success" | "error" | "info" = "success"
      ) => {
        switch (type) {
          case "success":
            toast.success(message);
            break;
          case "error":
            toast.error(message);
            break;
          case "info":
            toast.info(message);
            break;
          default:
            toast(message);
        }
      },
    }),
    { name: "toast-store" }
  )
);
