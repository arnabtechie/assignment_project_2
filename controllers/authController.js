import jwt from "jsonwebtoken";
import User from "./../models/users.js";
import { validationResult } from "express-validator";
import catchAsync from "./../utils/catchAsync.js";
import dotenv from "dotenv";
// dotenv.config({ path: "./config.env" });

/**
 * @function login
 * @method POST
 * @param req
 * @param res
 * @returns {success or fail}
 **/

const login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      status: "fail",
      error: errors,
    });
  }
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || user.password !== password.toString()) {
    return res.status(400).send({
      status: "fail",
      message: "invalid username or password",
    });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  user.password = undefined;

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  return res.status(200).send({
    status: "success",
    data: user,
    token: token,
  });
});

/**
 * @function logout
 * @method GET
 * @param req
 * @param res
 * @returns {success or fail}
 **/

const logout = catchAsync(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  return res.status(200).json({ status: "success" });
});

export default { login, logout };
