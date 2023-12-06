import jwt from "jsonwebtoken";
//model to generate jwt
const generateJWT = (id) => {
    return jwt.sign( { id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
}

export default generateJWT;