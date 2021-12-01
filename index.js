import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { foodRouter } from './routes/pizza.js';
import { usersRouter } from './routes/users.js';
import { adminRouter } from './routes/admin.js';
import cors from  'cors'
import {auth} from './middleware/auth.js'
dotenv.config()
const app = express();
const PORT = process.env.PORT || 9000
app.use(express.json()) // make requests as json
app.use(cors())
// mongo db config
const MONGO_URL = process.env.MONGO_URL

 // create db connection 

    async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect()
    console.log("I got the Database, Boss.")
    return client
    }

// DB Connection
export const client = await createConnection();


// routes

app.use('/', foodRouter )
app.use('/users', usersRouter)
app.use('/admin', adminRouter)

// host to server
app.listen(PORT, ()=> console.log("Server started in port " + PORT))