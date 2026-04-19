import jwt from 'jsonwebtoken';

//function to generate JWT token
const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET );
    return token;
}
export default generateToken;