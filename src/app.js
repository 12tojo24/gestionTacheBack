// src/app.js  — ajouter charset UTF-8 pour les accents (À faire, Terminé...)

const express      = require("express");
const cors         = require("cors");
const taskRoutes   = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Forcer UTF-8 pour les caractères accentués dans les ENUM
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API opérationnelle", timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

app.use(errorHandler);

module.exports = app;