import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req,res) => {
    const { project } = req.body;
    //extract project to the body and find by id in the project
    const exitProject = await Project.findById(project);
    if(!exitProject) {
        const error = new Error("The project is not found");
        return res.status(404).json({msg: error.message});
    }

    if(exitProject.creator.toString() !== req.user._id.toString()) {
        const error = new Error("Don't have permission to  add tasks");
        return res.status(403).json({msg: error.message});
    }

    try {
        //extract task creator from de req.body
        const taskSave = await Task.create(req.body);
        //save ID in the project
        exitProject.tasks.push(taskSave._id)
        await exitProject.save();
        res.json(taskSave);
    } catch (error) {
        console.log(error);
    }
};

const getTask = async (req,res) => {
    const { id } = req.params;
    //extract id of params and find by id with populate project
    const task = await Task.findById(id).populate("project");
    if(!task){
        const error = new Error("The task is not found");
        return res.status(404).json({msg: error.message});
    }
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error("Invalid action");
        return res.status(403).json({msg: error.message});
    }
    res.json(task)
};

const updateTask = async (req,res) => {
    const { id } = req.params;
    //extract id of params and find by id with populate project
    const task = await Task.findById(id).populate("project");
    if(!task){
        const error = new Error("The task is not found");
        return res.status(404).json({msg: error.message});
    }
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error("Invalid action");
        return res.status(403).json({msg: error.message});
    }
    //if the info changed, update, else save the task previous info
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.entryDate = req.body.entryDate || task.entryDate;
    try {
        //return this info
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
 const task = await Task.findById(id).populate("project");
 //verify task exist
 if(!task){
   const error = new Error("Not found");
   return res.status(404).json({ msg: error.message});
 }
 // verify the creator user of task 
 if(task.project.creator.toString() !== req.user._id.toString()){ 
   const error = new Error("Not Authorized"); 
   return res.status(404).json({ msg: error.message});
 };
 try {
    //find the task to delete
    const project = await Project.findById(task.project)
    project.tasks.pull(task._id)

    //detele this task and save other info
    await Promise.allSettled([await project.save(), await task.deleteOne()])
    res.json({ msg: "Deleted task successfully" });
    
 } catch (error) {
   console.log(error);
 }
};

const changeState = async (req,res) => {
     //identify task
    const { id } = req.params;
    //ask task with project
    const task = await Task.findById(id).populate("project");
    //verify task exist
    if(!task){
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message});
    }
    if(task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some( (collaborator) => collaborator._id.toString() === req.user._id.toString() )){ 
        const error = new Error("Not Authorized"); 
        return res.status(404).json({ msg: error.message});
      };
      //save info is it is different
      task.state = !task.state;
      task.completed = req.user._id
      
      await task.save();
      //ask by id and save project and completed status
      const taskSaved = await Task.findById(id).populate("project").populate('completed');

      res.json(taskSaved)
};

export { addTask, getTask, updateTask, deleteTask, changeState }