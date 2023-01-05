const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// User
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: { users }
  });
});

exports.getUser = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Invalid address'
  });
};

exports.createUser = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Invalid address'
  });
};

exports.updateUser = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Invalid address'
  });
};
exports.deleteUser = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'Invalid address'
  });
};
