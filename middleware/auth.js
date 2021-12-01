import { ObjectId } from 'bson';
import jwt from 'jsonwebtoken';
import { client } from '../index.js';
//  custom  middleware

export const auth = async (req, res, next)=>{
    try{
        const token = req.header("auth-token")
        let checkToken = jwt.verify(token, process.env.SECRET_KEY)
        let get_DB_Data = await client.db("pizza").collection("users").findOne({_id:new ObjectId(checkToken)})
        console.log(`Successfully login with user -  ${get_DB_Data.username} !!`)
        next();
    }catch(err){
        res.status(401).send({message: "Invalid page"})
    }
}