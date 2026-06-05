const VALID = {
  category: ["Design","Dev","Marketing","RH","Finance","Autre"],
  priority: ["Urgent","Haute","Normale","Basse"],
};

const validateTask = (req, res, next) => {
  const { title, category, priority } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ success: false, message: "Titre obligatoire" });
  }
  if (title.length > 255) {
    return res.status(400).json({ success: false, message: "Titre trop long" });
  }
  if (category && !VALID.category.includes(category)) {
    return res.status(400).json({ success: false, message: "Catégorie invalide" });
  }
  if (priority && !VALID.priority.includes(priority)) {
    return res.status(400).json({ success: false, message: "Priorité invalide" });
  }
  next();
};

const validateStatus = (req, res, next) => next();

module.exports = { validateTask, validateStatus };