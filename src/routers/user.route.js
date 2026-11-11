import express from 'express'
import { getUserController, setUserController } from '../controllers/user.controllers.js';

const router=express.Router();


router.get("/getuser", getUserController)
router.post("/register", setUserController)


export default router