const express = require("express");
const router = express.Router();

const {
  createProject,
  updateProject,
  getProjectById, 
  getProjects, 
  deleteProject
} = require("../controllers/project");
const { auth } = require("../middlewares/auth");

router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.get("/:id", auth, getProjectById);
router.get("/", auth, getProjects);
router.delete("/:id", auth, deleteProject);

module.exports = router;
