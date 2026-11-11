import express from 'express'
import { getUserController, setUserController, LoginController } from '../controllers/user.controllers.js';

const router=express.Router();


router.get("/getuser", getUserController)
router.post("/register", setUserController)
router.post("/login", LoginController)


export default router