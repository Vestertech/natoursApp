const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// User
exports.getAllUsers = factory.getAll(User);
// catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'Success',
//     results: users.length,
//     data: { users }
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3)  Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getUser = factory.getOne(User);
//   (req, res) => {
//   return res.status(500).json({
//     status: 'fail',
//     message: 'Invalid address'
//   });
// };

exports.createUser = (req, res) => {
  return res.status(500).json({
    status: 'fail',
    message: 'This route is not defined, please, use /signUp instead!'
  });
};

// Do not update password with this! exports Fn details....
exports.updateUser = factory.updateOne(User);
//   (req, res) => {
//   return res.status(500).json({
//     status: 'fail',
//     message: 'Invalid address'
//   });
// };
exports.deleteUser = factory.deleteOne(User);
