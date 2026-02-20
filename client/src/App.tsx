import { useEffect, useState } from "react";
import { Todo } from "./types";
import * as api from "./api";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    api.fetchTodos().then(setTodos);
  }, []);

  const handleAdd = async (title: string) => {
    const todo = await api.createTodo(title);
    setTodos((prev) => [todo, ...prev]);
  };

  const handleUpdate = async (
    id: number,
    data: { title?: string; completed?: boolean }
  ) => {
    const updated = await api.updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    setEditingTodo(null);
  };

  const handleDelete = async (id: number) => {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div className="app">
      <h1>ToDo App</h1>
      <TodoForm
        onAdd={handleAdd}
        editingTodo={editingTodo}
        onUpdate={handleUpdate}
        onCancelEdit={handleCancelEdit}
      />
      <TodoList
        todos={todos}
        onToggle={(id, completed) => handleUpdate(id, { completed })}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
