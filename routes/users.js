import express from 'express';
import {keyGenerator, getSignup, getUserByName, getUserInfo} from '../helper.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import { auth } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config()

const router = express.Router();
//  mail config


var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type:"OAuth2",
        user: "mail2pizzaguy@gmail.com", 
        clientId: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        refreshToken: process.env.G_R_TOKEN,
        accessToken: process.env.G_A_TOKEN
      
    }
  });
  



router
.route('/signup')
.post(async (req, res)=>{
    // body will be none if do with query
    const data = req.body;
    
    // password generator

    let passcode = new Date().getTime();

    passcode = passcode-1638334510000
        
    const hashWord = await keyGenerator(`${passcode}`)



    //  check user avalaiblity
    let checkUserAvailability = await getUserByName(data.username)
    
    // check password strength 
    // let passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/.test(`${data.password}`)

    // (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myForm.emailAddr.value))
    // check username
    let MailStrength = /[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(`${data.email}`)

    //  /^[A-Za-z\d_]{4,}$/ =>username

    let UserNameStrength = /^[A-Za-z\d_]{4,}$/.test(`${data.username}`)

    // conditional statements
    if(checkUserAvailability){
        res.send({message : "Username Already Exist - Better Luck Next Time 😈"})
    }
    // else if (!passwordStrength){
    //     res.send({message : `Password must be longer \n \t - Atleast 6 characters \n \t - Atleast one letter \n \t - Atleast one number \n \t - Atleast one special characters `})
    // }
    else if (!MailStrength){
        res.send({message : `invalid mail`})
    }else if (!UserNameStrength){
        res.send({message : `invalid userName - only contains letters, numbers and _ and should min 4 characters.`})}
    else{
        data.password =  hashWord 
        let db_responce = await getSignup(data)
        // verify
        var mailOptions = {
            from: 'PIZZA GUY_ <mail2pizzaguy@gmail.com>',
            to: data.email,
            subject: "User Confirmation",
            generateTextFromHTML: true,
            html: `<b>Hello User !!</b> <p>Use these credentials to log in <p>username : ${data.username}</p>password : ${passcode}<p></p> <a href='http://localhost:3000/login'> Log in </a></p>`
          };
     smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error);
          return null
        } else {
          console.log(response);
          db_responce.verify = true
          res.send(db_responce)
        }
        smtpTransport.close();
      });

        
    }
    
})





// login
router
.route('/login')
.post(async (req, res)=>{

    // body will be none if do with query

    const {username, password} = req.body ;

    // check user 

    const getUser = await getUserByName(username)
    
    if(!getUser){
        res.status(401).send({message: "Invalid Credentials 💔"})
    }else if(getUser){
    //  check credentails
    const checkCred = await bcrypt.compare(password, getUser.password )

    if (checkCred){
        // token creation
        const token =  jwt.sign(getUser._id.toJSON(), process.env.SECRET_KEY)
        res.send({message: 'Log in Successfull 🤗', apiKey : token})
    } else if(!checkCred) {
        res.send({message:'Invalid Credentials 💔'})
    }
}
   
})


router
.route('/profile')
.get(auth, getUserInfo)



export const usersRouter = router


