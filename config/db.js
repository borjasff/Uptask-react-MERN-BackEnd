import mongoose from "mongoose";

//connect to database in mongodb
const connectDB = async () => {
    try {
        const connection = await mongoose.connect( process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${connection.connection.host}:${connection.connection.port}`
        
        
        
    } catch (error) {
        console.error(`error: ${error.message}`);
        // force end of process
        process.exit(1);
    }
}

export default connectDB