const router = require("express").Router();
const {
  getAllTasks, getTaskById, createTask,
  updateTask, updateTaskStatus, deleteTask, getStats,
} = require("../controllers/taskController");
const { validateTask } = require("../middlewares/validate");
const { protect }      = require("../middlewares/auth");

router.use(protect);

router.get   ("/stats",      getStats);
router.get   ("/",           getAllTasks);
router.get   ("/:id",        getTaskById);
router.post  ("/",           validateTask, createTask);
router.put   ("/:id",        validateTask, updateTask);
router.patch ("/:id/status", updateTaskStatus);
router.delete("/:id",        deleteTask);

module.exports = router;