import { Router } from "express";
import postController from "./controllers/postController.js";
import { check } from "express-validator";
import authController from "./controllers/authController.js";
import auth from "./auth/auth.js";

const router = Router();

//-----------------------------------------Unauthenticated-------------------------------------------------//
router.post(
  "/login",
  [
    check("username", "Please enter valid username").notEmpty(),
    check("password", "Please enter valid password").notEmpty(),
  ],
  authController.login
);
router.post("/add", postController.add);
router.get("/fetch", postController.fetch);

//-----------------------------------------Auth Middleware-------------------------------------------------//
router.use(auth);

//-----------------------------------------Authenticated-------------------------------------------------//
router.get("/auth/logout", authController.logout);
router.post("/auth/add", postController.add);
router.get("/auth/fetch", postController.fetch);

export default router;
