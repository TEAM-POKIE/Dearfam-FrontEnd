import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";

export function WritePage() {
  return (
    <div className="h-app bg-bg-1">
      <SemiHeader title="게시글 작성" exit={false} />
      <Paper />
    </div>
  );
}
