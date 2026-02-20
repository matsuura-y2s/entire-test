import { useState, useEffect } from "react";
import { Todo } from "../types";

interface Props {
  onAdd: (title: string) => void;
  editingTodo: Todo | null;
  onUpdate: (id: number, data: { title: string }) => void;
  onCancelEdit: () => void;
}

export default function TodoForm({ onAdd, editingTodo, onUpdate, onCancelEdit }: Props) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
    } else {
      setTitle("");
    }
  }, [editingTodo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") return;

    if (editingTodo) {
      onUpdate(editingTodo.id, { title: title.trim() });
    } else {
      onAdd(title.trim());
    }
    setTitle("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a todo..."
      />
      <button type="submit">{editingTodo ? "Save" : "Add"}</button>
      {editingTodo && (
        <button type="button" className="cancel" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </form>
  );
}
