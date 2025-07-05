const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please add User Name"],
    },
    email: {
      type: String,
      required: [true, "Please add Email"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
      minLength: [6, "Password must be up to 6 characters"],
      trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

module.exports = mongoose.model("User", userSchema);
