import { useWritePostStore } from "@/context/store/writePostStore";

export const InputTitle = () => {
  const { title, setTitle } = useWritePostStore();
  return (
    <input
      className="p-[0.625rem] text-h5 placeholder:text-gray-3 text-gray-2 w-full bg-[#F3F3F3] border-none outline-none"
      type="text"
      placeholder="제목을 입력해주세요."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};
