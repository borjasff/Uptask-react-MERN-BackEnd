import Proyect from "../models/Proyect.js"


const getProyects = async (req, res) => {
  const proyects = await Proyect.find().where("creator").equals(req.user);
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

  const proyect = await Proyect.findById(id);
  
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
const addColaborator = async (req, res) => {
  
}
const deleteColaborator = async (req, res) => {
  
}
const getTasks = async (req, res) => {
  
}

export {getProyects, newProyect, getProyect, editProyect, deleteProyect, addColaborator, deleteColaborator, getTasks }