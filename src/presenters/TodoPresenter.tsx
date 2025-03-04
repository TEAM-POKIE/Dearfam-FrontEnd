import { useState } from "react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../viewmodels/TodoViewModel";
import { TodoFormValues } from "../lib/validation/todoSchema";
import { Todo } from "../lib/api/todoApi";

export interface TodoPresenterProps {
  children: (props: {
    todos: Todo[] | undefined;
    isLoading: boolean;
    isError: boolean;
    selectedTodo: Todo | null;
    selectTodo: (todo: Todo | null) => void;
    createTodo: (data: TodoFormValues) => void;
    updateTodo: (id: string, data: Partial<TodoFormValues>) => void;
    deleteTodo: (id: string) => void;
    toggleTodoCompletion: (todo: Todo) => void;
  }) => React.ReactNode;
}

export function TodoPresenter({ children }: TodoPresenterProps) {
  // 선택된 Todo 상태
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // ViewModel에서 데이터 및 기능 가져오기
  const { data: todos, isLoading, isError } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  // Todo 생성 함수
  const createTodo = (data: TodoFormValues) => {
    createTodoMutation.mutate(data);
  };

  // Todo 업데이트 함수
  const updateTodo = (id: string, data: Partial<TodoFormValues>) => {
    updateTodoMutation.mutate({ id, data });
  };

  // Todo 삭제 함수
  const deleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  };

  // Todo 완료 상태 토글 함수
  const toggleTodoCompletion = (todo: Todo) => {
    updateTodoMutation.mutate({
      id: todo.id,
      data: { completed: !todo.completed },
    });
  };

  // View에 필요한 데이터와 함수 전달
  return (
    <>
      {children({
        todos,
        isLoading,
        isError,
        selectedTodo,
        selectTodo: setSelectedTodo,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleTodoCompletion,
      })}
    </>
  );
}
