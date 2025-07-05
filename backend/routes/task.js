const express = require("express");
const router = express.Router();

const {
 createTask,
 updateTask,
 getTaskById, 
 getAllTasks,
 deleteTask
} = require("../controllers/task");
const { auth } = require("../middlewares/auth");

router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.get("/:id", auth, getTaskById);
router.get("/", auth, getAllTasks);
router.delete("/:id", auth, deleteTask);

module.exports = router;
