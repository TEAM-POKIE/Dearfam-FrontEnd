import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group w-full flex justify-center items-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast  max-w-fit group-[.toaster]:bg-main-1 group-[.toaster]:text-white group-[.toaster]:text-body3    group-[.toaster]:rounded-[1.25rem] group-[.toaster]:border-none group-[.toaster]:px-[1.25rem] group-[.toaster]:py-[0.625rem] ",
          description: "",
          actionButton: "group-[.toast]:bg-main-1 group-[.toast]:text-white ",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:rounded-lg",
        },
        duration: 3000,
      }}
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
