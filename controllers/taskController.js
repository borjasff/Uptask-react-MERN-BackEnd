import Proyect from "../models/Proyect.js";
import Task from "../models/Task.js";

const addTask = async (req,res) => {
    const { proyect } = req.body;

    const exitProyect = await Proyect.findById(proyect);
    if(!exitProyect) {
        const error = new Error("The proyect is not found");
        return res.status(404).json({msg: error.message});
    }

    if(exitProyect.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Don't have permission to  add tasks");
        return res.status(403).json({msg: error.message});
    }

    try {
        const taskSave = await Task.create(req.body);
        //save ID in the proyect
        exitProyect.tasks.push(taskSave._id)
        await exitProyect.save();
        res.json(taskSave);
    } catch (error) {
        console.log(error);
    }
};

const getTask = async (req,res) => {
    const { id } = req.params;

    const task = await Task.findById(id).populate("proyect");
    if(!task){
        const error = new Error("The task is not found");
        return res.status(404).json({msg: error.message});
    }
    if(task.proyect.creator.toString() !== req.user._id.toString()){
        const error = new Error("Invalid action");
        return res.status(403).json({msg: error.message});
    }
    res.json(task)
};

const updateTask = async (req,res) => {
    const { id } = req.params;

    const task = await Task.findById(id).populate("proyect");
    if(!task){
        const error = new Error("The task is not found");
        return res.status(404).json({msg: error.message});
    }
    if(task.proyect.creator.toString() !== req.user._id.toString()){
        const error = new Error("Invalid action");
        return res.status(403).json({msg: error.message});
    }
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.entryDate = req.body.entryDate || task.entryDate;
    try {
        const saveTask = await task.save();
        res.json(saveTask);
    } catch (error) {
        console.log(error);
    }
};

const deleteTask = async (req,res) => {
 //identify task
 const { id } = req.params;
 //ask db
 const task = await Task.findById(id).populate("proyect");
 //verify task exist
 if(!task){
   const error = new Error("Not found");
   return res.status(404).json({ msg: error.message});
 }
 // verify the creator user of task 
 if(task.proyect.creator.toString() !== req.user._id.toString()){ 
   const error = new Error("Not Authorized"); 
   return res.status(404).json({ msg: error.message});
 };
 try {
   await task.deleteOne();
   res.json({ msg: "Deleted task successfully" });
 } catch (error) {
   console.log(error);
 }
};

const changeState = async (req,res) => {

};

export { addTask, getTask, updateTask, deleteTask, changeState }