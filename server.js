// server.js
require("dotenv").config();
const app  = require("./src/app");
const PORT = process.env.PORT || 5000;

// ✅ 0.0.0.0 obligatoire pour Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});