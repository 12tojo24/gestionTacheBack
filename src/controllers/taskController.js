// src/controllers/taskController.js — fichier COMPLET
const db = require("../config/db");

// ✅ Déclarée EN HAUT avant toutes les fonctions
const normalizeStatus = (s) => {
  if (!s) return "A faire";
  const map = {
    "a faire":  "A faire",
    "A faire":  "A faire",
    "en cours": "En cours",
    "En cours": "En cours",
    "termine":  "Termine",
    "Termine":  "Termine",
    "à faire":  "A faire",
    "À faire":  "A faire",
    "terminé":  "Termine",
    "Terminé":  "Termine",
  };
  return map[s] || map[s.toLowerCase()] || "A faire";
};

const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;
    let sql = "SELECT * FROM tasks WHERE 1=1";
    const params = [];

    if (status)   { sql += " AND status = ?";   params.push(normalizeStatus(status)); }
    if (priority) { sql += " AND priority = ?"; params.push(priority); }
    if (category) { sql += " AND category = ?"; params.push(category); }
    if (search)   { sql += " AND title LIKE ?"; params.push(`%${search}%`); }

    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, due_date } = req.body;
    const status = normalizeStatus(req.body.status);

    const [result] = await db.query(
      `INSERT INTO tasks (title, description, category, priority, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description || null, category, priority, status, due_date || null]
    );
    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, category, priority, due_date } = req.body;
    const status = normalizeStatus(req.body.status);

    const [check] = await db.query(
      "SELECT id FROM tasks WHERE id = ?",
      [req.params.id]
    );
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }
    await db.query(
      `UPDATE tasks
       SET title=?, description=?, category=?, priority=?, status=?, due_date=?
       WHERE id = ?`,
      [title, description || null, category, priority, status, due_date || null, req.params.id]
    );
    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const status = normalizeStatus(req.body.status);
    // console.log("updateTaskStatus — id:", req.params.id, "| status:", status);

    const [check] = await db.query(
      "SELECT id FROM tasks WHERE id = ?",
      [req.params.id]
    );
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }
    await db.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, req.params.id]
    );
    const [rows] = await db.query(
      "SELECT * FROM tasks WHERE id = ?",
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const [check] = await db.query(
      "SELECT id FROM tasks WHERE id = ?",
      [req.params.id]
    );
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: "Tâche introuvable" });
    }
    await db.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Tâche supprimée" });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [[totals]] = await db.query(`
      SELECT
        COUNT(*)                                            AS total,
        SUM(status = 'Termine')                            AS done,
        SUM(status = 'En cours')                           AS in_progress,
        SUM(status = 'A faire')                            AS todo,
        SUM(priority = 'Urgent' AND status != 'Termine')   AS urgent,
        SUM(due_date < CURDATE() AND status != 'Termine')  AS overdue
      FROM tasks
    `);
    res.json({
      success: true,
      data: {
        total:       Number(totals.total       || 0),
        done:        Number(totals.done        || 0),
        in_progress: Number(totals.in_progress || 0),
        todo:        Number(totals.todo        || 0),
        urgent:      Number(totals.urgent      || 0),
        overdue:     Number(totals.overdue     || 0),
      },
    });
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