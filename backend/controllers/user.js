const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "_id userName");

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    next(error);
  }
};
