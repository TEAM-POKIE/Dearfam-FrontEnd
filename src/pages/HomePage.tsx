import { TodoFeature } from "../features/TodoFeature";

export function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">홈</h1>
      <TodoFeature />
    </div>
  );
}
