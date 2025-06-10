const User = require("../models/User.js");
const response = require("../response/responseHandler.js");
const { generateToken } = require("../utils/jwtUtils.js");
const validateFields = require("../utils/validateFields.js");

// Đăng nhập
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!validateFields({ username, password, isLogin: true }))
      return response.badRequest(res);

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user || !(await user.comparePassword(password)))
      return response.unauthorized(res);

    const token = await generateToken({ id: user._id, roles: user.roles });

    const data = {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      accessToken: token,
    };

    return response.success(res, data);
  } catch (error) {
    next(error);
  }
}

// Đăng ký
async function register(req, res, next) {
  try {
    const { username, email, password, full_name: fullName } = req.body;

    if (!validateFields({ username, email, password, fullName }))
      return response.badRequest(res);

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) return response.badRequest(res);

    const newUser = new User({ username, email, password, fullName });
    await newUser.save();

    return response.created(res);
  } catch (error) {
    next(error);
  }
}

// Lấy tổng số người dùng
async function getTotalUsers(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    return res.status(200).json({ totalUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Lấy danh sách tất cả người dùng
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, { password: 0 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  login,
  register,
  getTotalUsers,
  getAllUsers,
};
