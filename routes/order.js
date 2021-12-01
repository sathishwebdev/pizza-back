import express from 'express';
import { client } from '../index.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router
.route('/')
.get(auth,async (req, res)=>{
    const token = req.header("auth-token")

    let orders = await client
    .db("pizza")
    .collection("orders")
    .findOne({user_Id: userId})
    
    res.send(orders)
} )
.post(auth, async (req, res)=>{
    let userId = req.params.id;

    let orderData = reg.body;

    let placeOrder =  await client
    .db("pizza")
    .collection("stock")
    .insertMany({...orderData, user_Id: userId})

    res.send(placeOrder)

})
