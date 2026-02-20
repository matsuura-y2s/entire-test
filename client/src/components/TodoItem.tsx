import { Todo } from "../types";

interface Props {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={!!todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
      />
      <span className={`title ${todo.completed ? "completed" : ""}`}>
        {todo.title}
      </span>
      <button className="edit-btn" onClick={() => onEdit(todo)}>
        Edit
      </button>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </li>
  );
}
