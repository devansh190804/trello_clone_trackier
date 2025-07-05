const Project = require("../models/project");
const createError = require("http-errors");

exports.createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw createError(400, "Title and description are required");
    }

    const project = new Project({
      title,
      description,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    await project.save();

    res.status(201).json({
      success: true,
      project: {
        id: project._id,
        title: project.title,
        description: project.description,
        createdBy: project.createdBy,
        updatedBy: project.updatedBy,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!project) {
      throw createError(404, "Project not found");
    }

    if (project.createdBy.toString() !== req.user.id) {
      throw createError(403, "Not authorized to access this project");
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid project ID"));
    }
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      throw createError(400, "Title and description are required");
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      throw createError(404, "Project not found");
    }

    if (project.createdBy.toString() !== req.user.id) {
      throw createError(403, "Not authorized to update this project");
    }

    project.title = title;
    project.description = description;
    project.updatedBy = req.user.id;

    await project.save();

    res.status(200).json({
      success: true,
      project: {
        id: project._id,
        title: project.title,
        description: project.description,
        createdBy: project.createdBy,
        updatedBy: project.updatedBy,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid project ID"));
    }
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      throw createError(404, "Project not found");
    }

    if (project.createdBy.toString() !== req.user.id) {
      throw createError(403, "Not authorized to delete this project");
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid project ID"));
    }
    next(error);
  }
};