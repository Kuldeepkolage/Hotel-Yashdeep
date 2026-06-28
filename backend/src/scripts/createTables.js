import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/database.js";
import Table from "../models/Table.js";

await connectDB();

const exists = await Table.countDocuments();

if(exists>0){

console.log("Tables already exist");
process.exit();

}

const tables=[];

for(let i=1;i<=20;i++){

tables.push({

tableNumber:i,

tableName:`Table ${i}`,

capacity:i<=10?4:6,

location:i<=12?"Indoor":"Family"

});

}

await Table.insertMany(tables);

console.log("20 Tables Created");

process.exit();