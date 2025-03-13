import CommonButton from "@/components/common_btn";

export function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">홈</h1>
      <div className="flex items-center justify-center">
        <CommonButton text="테스트sd" color="main_2" size={270} />
      </div>
    </div>
  );
}
