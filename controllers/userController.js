const { hashSync, genSaltSync } = require("bcrypt");
const queries = require("../utils/queries");
const AppError = require("../utils/appError");

exports.getUserId = catchAsync("userId", async (req, res, next, userId) => {
  try {
    const user = await queries.getOne("User", userId);
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError(error), 404);
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  return res.send({
    code: 200,
    status: json({ user: req.user }),
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  console.log("Parsed req.body:", req.body); //

  try {
    // const userName = req.body.user.username;
    // let password = req.body.user.password;

    const userName = req.body.username;
    let password = req.body.password;

    if (!userName || !password) {
      return next(new AppError("Wrong username or password"), 404);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await queries.insertUser(userName, password);
    console.log("====================================");
    console.log("user", user);
    console.log("====================================");
    return res.status(201).json({ user: user });
    // return res.send({
    //   code: 201,
    //   status: json({ user: user }),
    // });
  } catch (error) {
    return next(new AppError(error), 400);
  }
});

exports.updateUser = async (req, res, next) => {
  try {
    const userName = req.body.user.username;
    const role = req.body.user.role;
    let password = req.body.user.password;
    const userId = req.params.id;

    if (!userName || !role || !password) {
      return next(new AppError("Wrong username or password"), 400);
    }

    const salt = genSaltSync(10);
    password = hashSync(password, salt);

    const user = await queries.updateUser(userName, role, password, userId);
    return res.send({
      code: 200,
      status: "User updated successfully",
    });
  } catch (error) {
    return res.send({
      code: 400,
      status: error,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await queries.deleteUser(userId);
    return res.send({
      code: 204,
      status: "User deleted successfully",
    });
  } catch (error) {
    return next(new AppError(error), 400);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await queries.allUser();
    return res.send({
      code: 200,
      status: json({ users: users }),
    });
  } catch (error) {
    return next(new AppError(error), 400);
  }
};
