const express      = require("express");
const cors         = require("cors");
const authRoutes   = require("./routes/authRoutes");
const taskRoutes   = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: "*", credentials: false }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",  authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API opérationnelle", timestamp: new Date() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

app.use(errorHandler);

module.exports = app;