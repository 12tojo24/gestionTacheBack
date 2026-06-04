// src/app.js
const express    = require("express");
const cors       = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API opérationnelle", timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

// Error handler
app.use(errorHandler);

module.exports = app;