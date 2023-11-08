import User from "../models/User.js";
import generateId from "../helpers/generateId.js"
import generateJWT from "../helpers/generateJWT.js";

const register = async (req, res) => {
    //req send to server and res send to user
    
    //avoid duplicate registration
    const { email} = req.body;
    const userExit = await User.findOne({ email});
    
    if( userExit){
        const error = new Error ("User registered")
        
        return res.status(404).json({ msg: error.message });
    }
    try {
        //create user with info model
        const user = new User(req.body);
        user.token = generateId();
        const userSave = await user.save();
        res.json(userSave);
    } catch (error) {
        console.error(error);
    }

}
//autentication user registration
 const autentification = async (req, res) => {
    const { email, password } = req.body;

    //verify if user exits
    const user = await User.findOne({email});
    if(!user){
        const error = new Error("User not found");
        return res.status(404).json({ msg: error.message});
    }

    //verify if user is confirmed
    if(!user.confirm){
        const error = new Error("User not confirmed");
        return res.status(403).json({ msg: error.message});
    }

    //verify password
    if( await user.verifyPassword(password)){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id),
        });
    } else{
        const error = new Error("Password not correct");
        return res.status(403).json({ msg: error.message});
    }

 };

export { register, autentification };