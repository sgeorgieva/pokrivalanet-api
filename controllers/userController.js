const { hashSync, genSaltSync } = require("bcrypt");
const pool = require("../utils/pool2");

exports.getUserId = catchAsync('userId', async (req, res, next, userId) => { 
  try {
    const user = await pool.getOne("User", userId);
    req.user = user;
    next();
  } catch(error) {
    return res.send({
      "code": 404,
      "status": error
    });
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  return res.send({
    "code": 200,
    "status": json({user: req.user})
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  try {
    const userName = req.body.user.username;
    let password = req.body.user.password;

    if (!userName || !password) {
      return res.send({
        "code": 404,
        "status": error
      });
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await pool.insertUser(userName, password);
    return res.send({
      "code": 201,
      "status": json({user: user})
    });
  } catch(error) {
    return res.send({
      "code": 400,
      "status": error
    });
  }
});

exports.updateUser = (async (req, res, next) => {
  try {
    const userName = req.body.user.username;
    const role = req.body.user.role;
    let password = req.body.user.password;
    const userId = req.params.id;

    if (!userName || !role || !password) {
      return res.sendStatus(400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user =  await pool.updateUser(userName, role, password, userId);
    return res.send({
      "code": 200,
      "status": "User updated successfully"
    });
  } catch(error) {
    return res.send({
      "code": 400,
      "status": error
    });
  }
});

exports.deleteUser = (async (req, res, next) => {
  try {
    const userId = req.params.id
    const user =  await pool.deleteUser(userId);
    return res.send({
      "code": 204,
      "status": "User deleted successfully"
    });
  } catch(error) {
    return res.send({
      "code": 400,
      "status": error
    });
  }
});

exports.getAllUsers = (async (req, res, next) => {
  try {
    const users = await pool.allUser();
    return res.send({
      "code": 200,
      "status": json({users: users})
    });
  } catch(error) {
    return res.send({
      "code": 400,
      "status": error
    });
  }
});