import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {getProjects, newProject, getProject, editProject, deleteProject,findCollaborator, addCollaborator, deleteCollaborator } from "../controllers/projectController.js";

const router = express.Router();

//routing
router
    .route("/")
    .get(checkAuth, getProjects)
    .post(checkAuth, newProject);

router
    .route("/:id")
    .get(checkAuth, getProject)
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject);

router.post('/collaborators', checkAuth, findCollaborator)
router.post("/collaborators/:id", checkAuth, addCollaborator);
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator);

export default router;
