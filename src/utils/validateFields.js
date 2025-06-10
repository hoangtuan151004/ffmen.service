const validateFields = ({
  username,
  password,
  fullName,
  email,
  isLogin = false,
}) => {
  if (!username || username.length < 6 || username.length > 30) return false;
  if (!password || password.length < 6 || password.length > 30) return false;
  if (!isLogin) {
    if (!fullName || fullName.length < 6 || fullName.length > 50) return false;
    if (!email || email.length < 6 || email.length > 30) return false;
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      return false;
  }
  return true;
};

module.exports = validateFields;
