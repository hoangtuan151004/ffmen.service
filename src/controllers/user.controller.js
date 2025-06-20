const userModel = require("../models/User");
const bcrypt = require("bcryptjs");

// Các hàm controller
async function getAllUsers() {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    console.log("Lỗi lấy danh sách user", error);
    throw error;
  }
}
async function getTotalUsers(req, res) {
  try {
    const users = await User.countDocuments();
    const totalUsers = users.length;

    res.status(200).json({
      totalUsers,
    });
  } catch (error) {
    console.error("Lỗi lấy tổng tài khoản:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUserById(id) {
  try {
    const user = await userModel.findById(id);
    return user;
  } catch (error) {
    console.log("Lỗi lấy thông tin user", error);
    throw error;
  }
}

async function addUser(body) {
  try {
    const { name, email, pass, phone, role } = body;
    const newUser = new userModel({ name, email, pass, phone, role });
    const result = await newUser.save();
    return result;
  } catch (error) {
    console.log("Lỗi thêm user", error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    console.log("Lỗi xóa user", error);
    throw error;
  }
}

async function updateUser(id, body) {
  try {
    const user = await userModel.findById(id);
    if (!user) throw new Error("Không tìm thấy user");
    const { name, email, pass, phone, role } = body;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, pass, phone, role },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    console.log("Lỗi cập nhật user", error);
    throw error;
  }
}

async function login(body) {
  try {
    const { name, password } = body;

    let user = await userModel.findOne({ name: name });
    if (!user) {
      throw new Error("Tên đăng nhập không tồn tại");
    }

    const checkpass = bcrypt.compareSync(password, user.password);
    if (!checkpass) {
      throw new Error("Mật khẩu không chính xác");
    }

    delete user._doc.password;

    return user;
  } catch (error) {
    console.log("Lỗi", error);
    throw error;
  }
}

async function register(body) {
  try {
    const { name, email, password, repassword, role } = body;

    if (password !== repassword) {
      throw new Error("Mật khẩu không trùng khớp");
    }

    let user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("Email đã tồn tại");
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    user = new userModel({ name, email, password: hash, role: role || 0 });

    const result = await user.save();
    return result;
  } catch (error) {
    console.log("Lỗi đăng ký", error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUser,
  login,
  register,
  getTotalUsers,
};
