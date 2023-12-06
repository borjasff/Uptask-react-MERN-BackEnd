//configuration to server
//search en node module express package
import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouters from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js";
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
app.use('/api/projects',  projectRoutes);
app.use('/api/tasks',  taskRoutes);


const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`listening on ${PORT} port`);
});

//socket io

import { Server } from "socket.io";

const io = new Server(server,{
    pingTimeout: 60000,
    cors:{
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', (socket) => {
    console.log('conectado a socket io')

   /** 
    //example to conect
    socket.on('prueba', (projects) => {
        console.log('prueba desde socket io', projects);
        socket.emit('respuesta', {name: 'borja'})
    })*/

    //Define events of socket io
    socket.on('open project', (project) =>{
        socket.join(project);
    })
    socket.on('new task', (task) => {
        const project = task.project;
        socket.to(project).emit('task added', task)
    })
    socket.on('delete Task', task => {
        const project = task.project;
        socket.to(project).emit('task deleted', task)
    })
    socket.on('update task', (task) => {
        const project = task.project._id;
        socket.to(project).emit('task updated', task)
    })
    socket.on('change state', (task) => {
        const project = task.project._id;
        socket.to(project).emit('new task', task)
    })

})