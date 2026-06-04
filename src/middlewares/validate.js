// src/middlewares/validate.js
const VALID = {
  category: ["Design","Dev","Marketing","RH","Finance","Autre"],
  priority: ["Urgent","Haute","Normale","Basse"],
  status:   ["À faire","En cours","Terminé"],
};

const validateTask = (req, res, next) => {
  const { title, category, priority, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ success: false, message: "Le titre est obligatoire" });
  }
  if (title.length > 255) {
    return res.status(400).json({ success: false, message: "Titre trop long (max 255 caractères)" });
  }
  if (category && !VALID.category.includes(category)) {
    return res.status(400).json({ success: false, message: `Catégorie invalide. Valeurs : ${VALID.category.join(", ")}` });
  }
  if (priority && !VALID.priority.includes(priority)) {
    return res.status(400).json({ success: false, message: `Priorité invalide. Valeurs : ${VALID.priority.join(", ")}` });
  }
  if (status && !VALID.status.includes(status)) {
    return res.status(400).json({ success: false, message: `Statut invalide. Valeurs : ${VALID.status.join(", ")}` });
  }

  next();
};

const validateStatus = (req, res, next) => {
  const { status } = req.body;
  if (!status || !VALID.status.includes(status)) {
    return res.status(400).json({ success: false, message: `Statut invalide. Valeurs : ${VALID.status.join(", ")}` });
  }
  next();
};

module.exports = { validateTask, validateStatus };