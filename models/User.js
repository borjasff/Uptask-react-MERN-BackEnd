import mongoose from "mongoose";
import bcrypt from "bcrypt";

//format data user
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String,
    },
    confirm: {
        type: Boolean,
        default: false
    },
},
    {
    //add two columns more (create and update)
    timestamps: true
    }
);
userSchema.pre('save', async function(next) {

    //if the user no modification the password, dont do anything
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    //generate a password hash with library bcrypt
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.verifyPassword = async function(passwordForm) {
    return await bcrypt.compare(passwordForm, this.password);
}

const User = mongoose.model("User", userSchema );

export default User;