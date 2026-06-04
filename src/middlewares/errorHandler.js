// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("❌", err.message);

  // Erreur MySQL
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "Entrée dupliquée" });
  }
  if (err.code && err.code.startsWith("ER_")) {
    return res.status(400).json({ success: false, message: "Erreur base de données" });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Erreur serveur" : err.message,
  });
};

module.exports = errorHandler;