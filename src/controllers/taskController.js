// src/controllers/taskController.js
const db = require("../config/db");

// ─── GET /tasks ───────────────────────────────────────────────────────────────
const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;

    let sql    = "SELECT * FROM tasks WHERE 1=1";
    const params = [];

    if (status)   { sql += " AND status = ?";              params.push(status); }
    if (priority) { sql += " AND priority = ?";            params.push(priority); }
    if (category) { sql += " AND category = ?";            params.push(category); }
    if (search)   { sql += " AND title LIKE ?";            params.push(`%${search}%`); }

    sql += " ORDER BY created_at DESC";

    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// ─── GET /tasks/:id ───────────────────────────────────────────────────────────
const getTaskById = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── POST /tasks ──────────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, due_date } = req.body;

    const [result] = await db.query(
      `INSERT INTO tasks (title, description, category, priority, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || null, category, priority, status, due_date || null]
    );

    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /tasks/:id ───────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, status, due_date } = req.body;

    const [check] = await db.query("SELECT id FROM tasks WHERE id = ?", [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }

    await db.query(
      `UPDATE tasks
       SET title = ?, description = ?, category = ?, priority = ?, status = ?, due_date = ?
       WHERE id = ?`,
      [title, description || null, category, priority, status, due_date || null, req.params.id]
    );

    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /tasks/:id/status ──────────────────────────────────────────────────
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const [check] = await db.query("SELECT id FROM tasks WHERE id = ?", [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }

    await db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, req.params.id]);

    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /tasks/:id ────────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const [check] = await db.query("SELECT id FROM tasks WHERE id = ?", [req.params.id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }

    await db.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);

    res.json({ success: true, message: "Tâche supprimée" });
  } catch (err) {
    next(err);
  }
};

// ─── GET /tasks/stats ─────────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*)                                          AS total,
        SUM(status = 'Terminé')                          AS done,
        SUM(status = 'En cours')                         AS in_progress,
        SUM(status = 'À faire')                          AS todo,
        SUM(priority = 'Urgent' AND status != 'Terminé') AS urgent,
        SUM(due_date < CURDATE() AND status != 'Terminé') AS overdue
      FROM tasks
    `);

    res.json({ success: true, data: totals });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getStats,
};