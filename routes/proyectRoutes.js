import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {getProyects, newProyect, getProyect, editProyect, deleteProyect,findCollaborator, addCollaborator, deleteCollaborator } from "../controllers/proyectController.js";

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

router.post('/collaborators', checkAuth, findCollaborator)
router.post("/collaborators/:id", checkAuth, addCollaborator);
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator);

export default router;
