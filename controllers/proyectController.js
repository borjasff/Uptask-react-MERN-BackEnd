import Proyect from "../models/Proyect.js"
import User from "../models/User.js";


const getProyects = async (req, res) => {
  const proyects = await Proyect.find({
    '$or' : [
      {'collaborators': {$in: req.user}},
      {'creator': {$in: req.user}},
    ]
  }).select("-tasks");
  res.json(proyects);
}


const newProyect = async (req, res) => {
  const proyect = new Proyect(req.body);
  proyect.creator = req.user._id;

  try {
    const proyectUpdate = await proyect.save();
    res.json(proyectUpdate);
  } catch (error) {
    console.log(error);
  }
}


const getProyect = async (req, res) => {
  const { id } = req.params;

  const proyect = await Proyect.findById(id).populate("tasks").populate("collaborators", "name email");
  
  if(!proyect){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
  }
  if(proyect.creator.toString() !== req.user._id.toString()){
    const error = new Error("Not Authorized"); 
    return res.status(404).json({ msg: error.message});
  };



    res.json(proyect);
}


const editProyect = async (req, res) => {
  const { id } = req.params;

  const proyect = await Proyect.findById(id);
  
  if(!proyect){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
  }
  if(proyect.creator.toString() !== req.user._id.toString()){
    const error = new Error("Not Authorized"); 
    return res.status(404).json({ msg: error.message});
  };
  proyect.name = req.body.name || proyect.name;
  proyect.description = req.body.description || proyect.description;
  proyect.entryDate = req.body.entryDate || proyect.entryDate;
  proyect.client = req.body.client || proyect.client;

  try {
    const saveProyect = await proyect.save();
    res.json(saveProyect)
  } catch (error) {
    console.log(error);
  }
}
const deleteProyect = async (req, res) => {
  //identify proyect
  const { id } = req.params;
  //ask db
  const proyect = await Proyect.findById(id);
  //verify proyect exist
  if(!proyect){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
  }
  // verify the creator user of proyect 
  if(proyect.creator.toString() !== req.user._id.toString()){ 
    const error = new Error("Not Authorized"); 
    return res.status(404).json({ msg: error.message});
  };
  try {
    await proyect.deleteOne();
    res.json({ msg: "Deleted proyect successfully" });
  } catch (error) {
    console.log(error);
  }
}
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
  const proyect = await Proyect.findById(req.params.id);
  //if not found proyect
  if(!proyect) {
    const error = new Error("Proyect Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  //if user isn't creator of Proyect
  if(proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Activity"); 
    return res.status(404).json({ msg: error.message});
  }
  const {email} = req.body
  const user = await User.findOne({ email }).select("-confirm -createdAt -password -token -updatedAt -__v")

  if(!user) {
    const error = new Error("User Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  //collaborator isnt admin of the proyect
  if(proyect.creator.toString() === user._id.toString()) {
    const error = new Error("Admin of the proyect cant be collaborator"); 
    return res.status(404).json({ msg: error.message});
  }
  //the user isnt added to the proyect
  if(proyect.collaborators.includes(user._id)){
    const error = new Error("User already added to the proyect"); 
    return res.status(404).json({ msg: error.message});
  }

  // if all is right, we can add the user to the proyect as collaborator
  proyect.collaborators.push(user._id);
  await proyect.save()
  res.json( { msg: "Collaborator added successfully"})
}
const deleteCollaborator = async (req, res) => {
  const proyect = await Proyect.findById(req.params.id);
  //if not found proyect
  if(!proyect) {
    const error = new Error("Proyect Not Found"); 
    return res.status(404).json({ msg: error.message});
  }
  //if user isn't creator of Proyect
  if(proyect.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Activity"); 
    return res.status(404).json({ msg: error.message});
  }
  // if all is right, we can delete the user to the proyect as collaborator
  proyect.collaborators.pull(req.body.id);
  await proyect.save()
  res.json( { msg: "Collaborator delete successfully"})
}


export {getProyects, newProyect, getProyect, editProyect, deleteProyect, addCollaborator, deleteCollaborator, findCollaborator }