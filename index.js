//configuration to server
//search en node module express package
import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouters from "./routes/userRoutes.js"
import proyectRoutes from "./routes/proyectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

//Routing
app.use('/api/users',  userRouters);
app.use('/api/proyects',  proyectRoutes);
app.use('/api/tasks',  taskRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT} port`);
});