import { ObjectId } from 'bson';
import jwt from 'jsonwebtoken';
import { client } from '../index.js';
//  custom  middleware

export const adAuth = async (req, res, next)=>{
    try{
        const token = req.header("auth-token")
        let checkToken = jwt.verify(token, process.env.ADMIN_SECRET_KEY)
        let get_DB_Data = await client.db("Movies").collection("admin").findOne({_id:new ObjectId(checkToken)})
        console.log(`Successfully login with Admin - ${get_DB_Data.username} !!`)
        next();
    }catch(err){
        res.status(401).send({message: "Invalid page"})
    }
}