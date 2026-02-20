import { Router } from "express";
import db from "../database.js";

const router = Router();

router.get("/", (_req, res) => {
  const todos = db.prepare("SELECT * FROM todos ORDER BY created_at DESC").all();
  res.json(todos);
});

router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const result = db
    .prepare("INSERT INTO todos (title) VALUES (?)")
    .run(title.trim());
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(todo);
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(Number(id));
  if (!existing) {
    res.status(404).json({ error: "todo not found" });
    return;
  }

  const updates: string[] = [];
  const values: unknown[] = [];

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "title must be a non-empty string" });
      return;
    }
    updates.push("title = ?");
    values.push(title.trim());
  }
  if (completed !== undefined) {
    updates.push("completed = ?");
    values.push(completed ? 1 : 0);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: "no fields to update" });
    return;
  }

  updates.push("updated_at = datetime('now')");
  values.push(Number(id));

  db.prepare(`UPDATE todos SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  const todo = db.prepare("SELECT * FROM todos WHERE id = ?").get(Number(id));
  res.json(todo);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM todos WHERE id = ?").run(Number(id));
  if (result.changes === 0) {
    res.status(404).json({ error: "todo not found" });
    return;
  }
  res.status(204).end();
});

export default router;
