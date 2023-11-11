import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const proyectsSchema = mongoose.Schema({
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
    entryDate: {
        type: Date,
        default: Date.now(),
    },
    client: {
        type: String,
        trim: true,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    colaborators: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
},
    {
        timestamps: true,
    }
);

const Proyect = mongoose.model('Proyect', proyectsSchema);
export default Proyect;