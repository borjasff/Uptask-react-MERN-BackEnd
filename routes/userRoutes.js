import express from "express";
const router = express.Router();
import { register, autentification, confirm, forgotPassword, verifyToken, newPassword, profile } from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

//autentication, register and confirm users

//public routes
router.post('/', register); //create new user
router.post('/login', autentification); //autentification user
router.get('/confirm/:token', confirm); //&confirm count with token
router.post('/forgot-password', forgotPassword); //forgot password
router.get('/forgot-password/:token', verifyToken); //verify token
router.post('/forgot-password/:token', newPassword); //verify token


//private area  
router.get('/profile', checkAuth, profile); //custom middleware to authenticate


export default router;