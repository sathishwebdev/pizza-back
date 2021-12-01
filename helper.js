import { client } from './index.js';
import fs from 'fs';
import bcrypt from 'bcrypt'
import { ObjectId } from 'bson';

// backup the deleting file
export const backup = async (fileData) => {

    await client
    .db("pizza")
    .collection("coldStorage")
    .findOne({id: request.params.id})

};


// all pizza

const allPizza = async (request, response) => {
    let filter = request.query;
    // if (filter.category) { filter.Language = filter.Language.toUpperCase(); }
    // if (filter.Rating) { filter.Rating = +filter.Rating; }
    let results = await client
        .db("pizza")
        .collection("stock")
        .find(filter)
        .toArray();
    response.send(results || { message: "no data founded" });
};

// /movies/id
const getById = async (request, response)=>{
    let filterResponse = await client
    .db("pizza")
    .collection("stock")
    .findOne({_id: new ObjectId(request.params.id)})
    response.send(filterResponse || {message: "no data founded"})
}


// delete stocks by id
const deleteFood =  async (request, response)=>{
    let dataToBackUp = await client
    .db("pizza")
    .collection("stock")
    .findOne({id: request.params.id})
    backup(dataToBackUp) 
    let filterResponse = await client
    .db("pizza")
    .collection("stock")
    .deleteOne({id: request.params.id})
    response.send(filterResponse || {message: "no data founded"})
}




// edit stocks

const editFood =  async (request, response)=>{
    const data =  request.body
    let result = await client
    .db("pizza")
    .collection("stock")
    .updateOne({id: request.params.id},{$set : data})

    let filterResponse = await client
    .db("Movies")
    .collection("Movie DB")
    .findOne({id: request.params.id})
    response.send( result.modifiedCount !== 0? filterResponse : {message: "no data founded"})
}



// add pizza

const addFood = async (request, response)=>{
    const data =  request.body
    console.log(data)
    let result = await client
    .db("pizza")
    .collection("stock")
    .insertMany(data)
    response.send(result)
}

// find pizza by name
const findByName = async (request, response)=>{
    let filterResponse = await client
    .db("pizza")
    .collection("stock")
    .find({name: request.params.name}).toArray()
    response.send(filterResponse || {message: "no data founded"})
}

// authentication

const keyGenerator = async (password)=>{    
     // salting   
    const saltedKey = await bcrypt.genSalt(10)
    //  hash the saltedKey
    const hashedKey = await bcrypt.hash(password, saltedKey)
    return hashedKey
}

// users

// get user by name
const getUserByName = async (name) => await client.db("pizza").collection("users").findOne({username: name})


// Signup

const getSignup = async (data) =>{
    let responce = await client
    .db("pizza")
    .collection("users")
    .insertOne(data)

    return {responce, data}
}

// admin
    // get admin by name
const getAdminByName = async (name) => await client.db("pizza").collection("admin").findOne({username: name})

    // // create Admin

    // const createAdmin = async (data) =>{
    //     let responce = await client
    //     .db("pizza")
    //     .collection("admin")
    //     .insertOne(data)
    
    //     return {responce, data}
    // }

    // get user by key
const getUserInfo = async (req, res) => {
        const token = req.header("auth-token");
        let checkToken = jwt.verify(token, process.env.SECRET_KEY);
        let get_DB_Data = await client.db("pizza").collection("users").findOne({ _id: new ObjectId(checkToken) });
        console.log(`Successfully login with user -  ${get_DB_Data.username} !!`);
        res.send(get_DB_Data);
    };
    

export {
    getAdminByName,
    getUserByName,
    getUserInfo,
    keyGenerator,
    getSignup,
    allPizza,
    findByName,
    getById,
    deleteFood,
    addFood,
    editFood
}