import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    state:{
        type: Boolean,
        default: false,
    },
    entryDate: {
        type: Date,
        default: Date.now(),
    },
    priority:{
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"],
    },
    proyect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyect',
    },
},
    {
        timestamps: true,
    }
);
const Task = mongoose.model('Task', taskSchema);
export default Task;