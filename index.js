//configuration to server
//search en node module express package
import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouters from "./routes/userRoutes.js"

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

//Routing
app.use('/api/users',  userRouters);




const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`listening on ${PORT} port`);
});