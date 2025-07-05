const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add Project Name"],
    },
    description: {
        type: String,
        required: [true, "Please add Project Description"],
      }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
