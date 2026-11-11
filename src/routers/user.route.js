import express from "express";
import {
  getUserController,
  setUserController,
  LoginController,
  getAllUsersController
} from "../controllers/user.controllers.js";
import { validateUser } from "../middleware/guard.middleware.js";

const router = express.Router();

router.get("/getuser", getUserController);
router.post("/register", setUserController);
router.post("/login", LoginController);
router.get("/getallusers", validateUser, getAllUsersController);

export default router;
