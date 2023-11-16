//configuration to server
//search en node module express package
import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouters from "./routes/userRoutes.js"
import proyectRoutes from "./routes/proyectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

//configuration cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) { 
        console.log(origin)
        if(whitelist.includes(origin)){
            //can API consult 
            callback(null, true);
        } else {
            //DONT HAVE PERMISSIONS
            callback(new Error("Error en el Cors"));
        }
    }
}
app.use(cors(corsOptions));
//Routing
app.use('/api/users',  userRouters);
app.use('/api/proyects',  proyectRoutes);
app.use('/api/tasks',  taskRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT} port`);
});