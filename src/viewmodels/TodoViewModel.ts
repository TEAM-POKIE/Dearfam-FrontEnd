import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoApi, Todo } from "../lib/api/todoApi";
import { TodoFormValues } from "../lib/validation/todoSchema";

// Todo 관련 쿼리 키
const TODO_KEYS = {
  all: ["todos"] as const,
  lists: () => [...TODO_KEYS.all, "list"] as const,
  list: (filters: string) => [...TODO_KEYS.lists(), { filters }] as const,
  details: () => [...TODO_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TODO_KEYS.details(), id] as const,
};

// Todo 목록 조회 훅
export function useTodos() {
  return useQuery({
    queryKey: TODO_KEYS.lists(),
    queryFn: todoApi.getTodos,
  });
}

// 단일 Todo 조회 훅
export function useTodo(id: string) {
  return useQuery({
    queryKey: TODO_KEYS.detail(id),
    queryFn: () => todoApi.getTodoById(id),
    enabled: !!id,
  });
}

// Todo 생성 훅
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TodoFormValues) => todoApi.createTodo(data),
    onSuccess: () => {
      // 성공 시 Todo 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
    },
  });
}

// Todo 업데이트 훅
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TodoFormValues> }) =>
      todoApi.updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      if (updatedTodo) {
        // 성공 시 해당 Todo 및 목록 쿼리 무효화
        queryClient.invalidateQueries({
          queryKey: TODO_KEYS.detail(updatedTodo.id),
        });
        queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
      }
    },
  });
}

// Todo 삭제 훅
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApi.deleteTodo(id),
    onSuccess: (_, id) => {
      // 성공 시 해당 Todo 및 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
    },
  });
}
