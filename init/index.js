const insertData = require('./data.js');
const mongoose = require('mongoose');
const listing = require('../model_listing/model.js');

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(()=>{
    console.log('Connection successful');
}).catch((err) =>{
    console.log('Connection failed');
});

const insertDB = async () =>{
    await listing.deleteMany();
    const dataWithOwner = insertData.data.map((obj) => ({
      ...obj,
      owner: new mongoose.Types.ObjectId("68a197c4ce891edc4822c360"), // ensure valid ObjectId
    }));
    await listing.insertMany(dataWithOwner);
}

insertDB();