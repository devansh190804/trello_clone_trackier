const { TASK_STATUS } = require("../common/constants");
const Task = require("../models/task");
const createError = require("http-errors");

exports.createTask = async (req, res, next) => {
  try {
    const { name, description, projectId, assignedUserId, dueDate, tags } = req.body;

    if (!name || !description || !projectId || !dueDate) {
      throw createError(400, "Name, description, projectId, and dueDate are required");
    }

    const task = new Task({
      name,
      description,
      projectId,
      platform: req.body.platform || TASK_STATUS.IN_DISCUSSION,
      assignedUserId: assignedUserId || req.user.id,
      dueDate,
      tags: tags || [],
      createdBy: req.user.id,
    });

    await task.save();

    res.status(201).json({
      success: true,
      task: {
        id: task._id,
        name: task.name,
        description: task.description,
        projectId: task.projectId,
        platform: task.platform,
        assignedUserId: task.assignedUserId,
        dueDate: task.dueDate,
        tags: task.tags,
        createdBy: task.createdBy,
        updatedBy: task.updatedBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid projectId or assignedUserId"));
    }
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { name, description, projectId, platform, assignedUserId, dueDate, tags } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      throw createError(404, "Task not found");
    }

    if (name) task.name = name;
    if (description) task.description = description;
    if (projectId) task.projectId = projectId;
    if (platform) task.platform = platform;
    if (assignedUserId) task.assignedUserId = assignedUserId;
    if (dueDate) task.dueDate = dueDate;
    if (tags) task.tags = tags;
    task.updatedBy = req.user.id;

    await task.save();

    res.status(200).json({
      success: true,
      task: {
        id: task._id,
        name: task.name,
        description: task.description,
        projectId: task.projectId,
        platform: task.platform,
        assignedUserId: task.assignedUserId,
        dueDate: task.dueDate,
        tags: task.tags,
        createdBy: task.createdBy,
        updatedBy: task.updatedBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid task ID, projectId, or assignedUserId"));
    }
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("projectId", "title")
      .populate("assignedUserId", "name email")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!task) {
      throw createError(404, "Task not found");
    }

    res.status(200).json({
      success: true,
      task: {
        id: task._id,
        name: task.name,
        description: task.description,
        projectId: task.projectId,
        platform: task.platform,
        assignedUserId: task.assignedUserId,
        dueDate: task.dueDate,
        tags: task.tags,
        createdBy: task.createdBy,
        updatedBy: task.updatedBy,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid task ID"));
    }
    next(error);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("projectId", "title")
      .populate("assignedUserId", "name email")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    const groupedTasks = {
      backlog: tasks.filter(task => task.platform === TASK_STATUS.BACKLOG),
      todo: tasks.filter(task => task.platform === TASK_STATUS.TODO),
      in_discussion: tasks.filter(task => task.platform === TASK_STATUS.IN_DISCUSSION),
      in_progress: tasks.filter(task => task.platform === TASK_STATUS.IN_PROGRESS),
      done: tasks.filter(task => task.platform === TASK_STATUS.DONE),
    };

    res.status(200).json({
      success: true,
      tasks: groupedTasks,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw createError(404, "Task not found");
    }

    const project = await Project.findById(task.projectId);
    if (!project || project.createdBy.toString() !== req.user.id) {
      throw createError(403, "Not authorized to delete this task");
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(createError(400, "Invalid task ID or projectId"));
    }
    next(error);
  }
};