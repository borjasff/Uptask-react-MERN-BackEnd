import express from "express";
const router = express.Router();
import { register, autentification } from "../controllers/userController.js";

//autentication, register and confirm users

router.post('/', register); //create new user
router.post('/login', autentification); //autentification user

export default router;