const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add Task Name"],
    },
    description: {
      type: String,
      required: [true, "Please add Task Description"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Please enter Project Id"],
    },
    platform: {
      type: String,
      enum: ["backlog", "in_discussion", "in_progress", "done", "todo"],
      default: "in_discussion",
    },
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
      required: [true, "Please add Task Due Date"],
    },
    tags: [
      {
        type: String,
      },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please add Created By"],
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);