import { TodoFormValues } from "../validation/todoSchema";

export interface Todo extends TodoFormValues {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockTodos: Todo[] = [
  {
    id: "1",
    title: "Learn React",
    description: "Study React fundamentals",
    completed: true,
    priority: "high",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  },
  {
    id: "2",
    title: "Learn TypeScript",
    description: "Study TypeScript basics",
    completed: false,
    priority: "medium",
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2023-01-03"),
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const todoApi = {
  // Get all todos
  async getTodos(): Promise<Todo[]> {
    await delay(500);
    return [...mockTodos];
  },

  // Get a todo by ID
  async getTodoById(id: string): Promise<Todo | undefined> {
    await delay(300);
    return mockTodos.find((todo) => todo.id === id);
  },

  // Create a new todo
  async createTodo(todoData: TodoFormValues): Promise<Todo> {
    await delay(500);
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockTodos.push(newTodo);
    return newTodo;
  },

  // Update a todo
  async updateTodo(
    id: string,
    todoData: Partial<TodoFormValues>
  ): Promise<Todo | undefined> {
    await delay(500);
    const todoIndex = mockTodos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return undefined;

    const updatedTodo = {
      ...mockTodos[todoIndex],
      ...todoData,
      updatedAt: new Date(),
    };
    mockTodos[todoIndex] = updatedTodo;
    return updatedTodo;
  },

  // Delete a todo
  async deleteTodo(id: string): Promise<boolean> {
    await delay(500);
    const todoIndex = mockTodos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) return false;

    mockTodos.splice(todoIndex, 1);
    return true;
  },
};
