import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {getProyects, newProyect, getProyect, editProyect, deleteProyect, addColaborator, deleteColaborator } from "../controllers/proyectController.js";

const router = express.Router();


router
    .route("/")
    .get(checkAuth, getProyects)
    .post(checkAuth, newProyect);

router
    .route("/:id")
    .get(checkAuth, getProyect)
    .put(checkAuth, editProyect)
    .delete(checkAuth, deleteProyect);

router.post("/add-colaborator/:id", checkAuth, addColaborator);
router.post("/delete-colaborator/:id", checkAuth, deleteColaborator);

export default router;
