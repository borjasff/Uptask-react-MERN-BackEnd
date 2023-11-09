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

 const confirm = async(req, res) => {
    //check if existing user is confirmed without token or with it
   const {token} = req.params
   const userConfirm = await User.findOne({token})
   if(!userConfirm){
    const error = new Error("Token not found");
    return res.status(403).json({ msg: error.message});
   } 
   try {
    //if user has token, clean token because is only one use
    userConfirm.confirm = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({msg: "User confirmed correctly"});
    console.log(userConfirm);

   } catch (error) {
    console.log(error);
   }
   
 }

 const forgotPassword = async (req, res) => {
    const{email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        const error = new Error("User not found");
        return res.status(404).json({ msg: error.message});
    }
    try {
        user.token = generateId()
        await user.save();
        res.json({msg: "we send email successfully with the instructions"})
        console.log(user);
    } catch (error) {
        console.log(error);
    }
 }
 const verifyToken = async (req, res) => {
        const {token} = req.params;

        const validToken = await User.findOne({ token});

        if(validToken){
            res.json({msg: "Token is valid and user exist"})
        } else{
            const error = new Error("Token not found");
            return res.status(404).json({ msg: error.message});
        }
 };
 const newPassword = async (req, res) => {
        const {token} = req.params;
        const {password} = req.body;


        const user = await User.findOne({ token});
        if(user){
            user.password = password;
            user.token = "";
            try {
                await user.save();
                res.json({msg: "Password changed successfully"})
            } catch (error) {
                console.log(error)
            }
        } else{
            const error = new Error("Token not found to change password");
            return res.status(404).json({ msg: error.message});
        }
 }

 const profile = async (req, res) => {
    console.log("from profile")
 }


export { register, autentification, confirm, forgotPassword, verifyToken, newPassword, profile};