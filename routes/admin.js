import express from 'express';
import {getAdminByName} from '../helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { adAuth } from '../middleware/adAuth.js';


const router = express.Router();
// login
router
.route('/login')
.post(async (req, res)=>{

    // body will be none if do with query

    const {username, password} = req.body ;

    // check user 

    const getUser = await getAdminByName(username)
    
    if(!getUser){
        res.status(401).send({message: "Invalid Credentials 💔"})
    }else if(getUser){
    //  check credentails
    const checkCred = await bcrypt.compare(password, getUser.password )

    if (checkCred){
        // token creation
        const token =  jwt.sign(getUser._id.toJSON(), process.env.ADMIN_SECRET_KEY)
        res.send({message: 'Log in Successfull 🤗', apiKey : token})
    } else if(!checkCred) {
        res.send({message:'Invalid Credentials 💔'})
    }
}
   
})


// .post(async (req, res)=>{
//     // body will be none if do with query
//     const data = req.body;
//     const hashWord = await keyGenerator(data.password) 
//     //  check user avalaiblity
//     let checkUserAvailability = await getAdminByName(data.username)
    
//     // check password strength 
//     let passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$_!%*#?&])[A-Za-z\d@_$!%*#?&]{6,}$/.test(`${data.password}`)

//     // check username
//     let usernameStrength = /^[A-Za-z\d_]{4,}$/.test(`${data.username}`)

//     // conditional statements
//     if(checkUserAvailability){
//         res.send({message : "Username Already Exist - Better Luck Next Time 😈"})
//     }else if (!passwordStrength){
//         res.send({message : `Password must be longer \n \t - Atleast 6 characters \n \t - Atleast one letter \n \t - Atleast one number \n \t - Atleast one special characters `})
//     }else if (!usernameStrength){
//         res.send({message : `Username should be min 3 characters - Only letters, numbers and _ can be accepteable`})
//     }
//     else{
//         data.password =  hashWord 
//         let db_responce = await createAdmin(data)
//         res.send(db_responce)
//     }
    
// })
router
.route('/')
.get(adAuth,async (req, res)=>{
    let userData = await client.db("pizza").collection("users").find({}).toArray()
    res.send(userData)
})
export const adminRouter = router