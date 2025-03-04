import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Todo } from "../lib/api/todoApi";
import { todoSchema, TodoFormValues } from "../lib/validation/todoSchema";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

interface TodoViewProps {
  todos: Todo[] | undefined;
  isLoading: boolean;
  isError: boolean;
  selectedTodo: Todo | null;
  selectTodo: (todo: Todo | null) => void;
  createTodo: (data: TodoFormValues) => void;
  updateTodo: (id: string, data: Partial<TodoFormValues>) => void;
  deleteTodo: (id: string) => void;
  toggleTodoCompletion: (todo: Todo) => void;
}

export function TodoView({
  todos,
  isLoading,
  isError,
  selectedTodo,
  selectTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
}: TodoViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      completed: false,
    },
  });

  // 폼 제출 처리
  const onSubmit = (data: TodoFormValues) => {
    if (selectedTodo && isEditing) {
      updateTodo(selectedTodo.id, data);
      setIsEditing(false);
    } else {
      createTodo(data);
    }
    reset();
    selectTodo(null);
  };

  // 편집 모드 시작
  const startEditing = (todo: Todo) => {
    selectTodo(todo);
    setIsEditing(true);
    reset({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      completed: todo.completed,
    });
  };

  // 편집 취소
  const cancelEditing = () => {
    setIsEditing(false);
    selectTodo(null);
    reset();
  };

  if (isLoading)
    return <div className="flex justify-center p-4">로딩 중...</div>;
  if (isError)
    return (
      <div className="flex justify-center p-4 text-red-500">
        오류가 발생했습니다.
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">할 일 관리</h1>

      {/* 할 일 입력 폼 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{isEditing ? "할 일 수정" : "새 할 일 추가"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                제목
              </label>
              <Input
                id="title"
                {...register("title")}
                placeholder="할 일 제목"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                설명
              </label>
              <Input
                id="description"
                {...register("description")}
                placeholder="할 일 설명 (선택사항)"
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                우선순위
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="low">낮음</option>
                <option value="medium">중간</option>
                <option value="high">높음</option>
              </select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={cancelEditing}>
              취소
            </Button>
            <Button type="submit">{isEditing ? "수정" : "추가"}</Button>
          </CardFooter>
        </form>
      </Card>

      {/* 할 일 목록 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">할 일 목록</h2>

        {todos && todos.length === 0 ? (
          <p className="text-gray-500">등록된 할 일이 없습니다.</p>
        ) : (
          todos?.map((todo) => (
            <Card key={todo.id} className="overflow-hidden">
              <div className="flex items-center p-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoCompletion(todo)}
                  className="mr-3 h-4 w-4"
                />

                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      todo.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p
                      className={`text-sm ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                  <div className="mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        todo.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : todo.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {todo.priority === "high"
                        ? "높음"
                        : todo.priority === "medium"
                        ? "중간"
                        : "낮음"}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(todo)}
                  >
                    편집
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
