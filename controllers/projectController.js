import Project from "../models/Project.js"
import User from "../models/User.js";

//get projects find collaborators and creator witout task and send res in format json of project
const getProjects = async (req, res) => {
  const projects = await Project.find({
    '$or' : [
      {'collaborators': {$in: req.user}},
      {'creator': {$in: req.user}},
    ]
  }).select("-tasks");
  res.json(projects);
}

//create a new project
const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectUpdate = await project.save();
    res.json(projectUpdate);
  } catch (error) {
    console.log(error);
  }
}

//get project
const getProject = async (req, res) => {
  const { id } = req.params;
  //find by id , to recobery tasks parameters
  const project = await Project.findById(id)
                                .populate({
                                      path: "tasks", 
                                      populate: {
                                            path: 'completed', select: 'name'}})
                                .populate("collaborators", "name email");
  
  //msg error
  if(!project){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
  }
  if(project.creator.toString() !== req.user._id.toString() && 
  !project.collaborators.some( (colaborator) => colaborator._id.toString() === req.user._id.toString() )){
    const error = new Error("Not Authorized"); 
    return res.status(404).json({ msg: error.message});
  };



    res.json(project);
}

//edit project
const editProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  
  if(!project){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
  }
  //creator is not the same as user
  if(project.creator.toString() !== req.user._id.toString()){
    const error = new Error("Not Authorized"); 
    return res.status(404).json({ msg: error.message});
  };
  //save the new valor or save in the project
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.entryDate = req.body.entryDate || project.entryDate;
  project.client = req.body.client || project.client;

  try {
    // to save edit, and return res
    const saveProject = await project.save();
    res.json(saveProject)
  } catch (error) {
    console.log(error);
  }
}


const deleteProject = async (req, res) => {
  //identify project
  const { id } = req.params;
  //ask db
  const project = await Project.findById(id);
  //verify project exist
  if(!project){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
  }
  // verify the creator user of project 
  if(project.creator.toString() !== req.user._id.toString()){ 
    const error = new Error("Not Authorized"); 
    return res.status(404).json({ msg: error.message});
  };
  try {
    await project.deleteOne();
    res.json({ msg: "Deleted project successfully" });
  } catch (error) {
    console.log(error);
  }
}

//find collaborator and select the params
const findCollaborator = async (req, res) => {
  const {email} = req.body
  const user = await User.findOne({ email }).select("-confirm -createdAt -password -token -updatedAt -__v")

  if(!user) {
    const error = new Error("User Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  res.json(user)
}


const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);
  //if not found project
  if(!project) {
    const error = new Error("Project Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  //if user isn't creator of Project
  if(project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Activity"); 
    return res.status(404).json({ msg: error.message});
  }
  const {email} = req.body
  const user = await User.findOne({ email }).select("-confirm -createdAt -password -token -updatedAt -__v")

  if(!user) {
    const error = new Error("User Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  //collaborator isnt admin of the project
  if(project.creator.toString() === user._id.toString()) {
    const error = new Error("Admin of the project cant be collaborator"); 
    return res.status(404).json({ msg: error.message});
  }
  //the user isnt added to the project
  if(project.collaborators.includes(user._id)){
    const error = new Error("User already added to the project"); 
    return res.status(404).json({ msg: error.message});
  }

  // if all is right, we can add the user to the project as collaborator
  project.collaborators.push(user._id);
  await project.save()
  res.json( { msg: "Collaborator added successfully"})
}


const deleteCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);
  //if not found project
  if(!project) {
    const error = new Error("Project Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  //if user isn't creator of Project
  if(project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Activity"); 
    return res.status(404).json({ msg: error.message});
  }
  // if all is right, we can delete the user to the project as collaborator
  project.collaborators.pull(req.body.id);
  await project.save()
  res.json( { msg: "Collaborator delete successfully"})
}


export {getProjects, newProject, getProject, editProject, deleteProject, addCollaborator, deleteCollaborator, findCollaborator }