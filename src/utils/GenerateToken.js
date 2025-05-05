import JWT from 'jsonwebtoken'
import { User } from '../models/User.model'

const GenerateToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        if(!user){
            throw Error("not found")
        }
        const token = JWT.sign({_id:user._id,email:user.email,},process.env.JWT_SECURE_KEY,{expiresIn:'7d'})
        return token;
    } catch (error) {
        return "Error",error
    }
}

export {GenerateToken}