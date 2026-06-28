import Table from "../models/Table.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createTable = asyncHandler(async(req,res)=>{

const table = await Table.create(req.body);

res.status(201).json({
success:true,
data:table
});

});

export const getTables = asyncHandler(async(req,res)=>{

const tables = await Table.find().sort({tableNumber:1});

res.json({
success:true,
data:tables
});

});

export const updateTable = asyncHandler(async(req,res)=>{

const table = await Table.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json({
success:true,
data:table
});

});

export const deleteTable = asyncHandler(async(req,res)=>{

await Table.findByIdAndDelete(req.params.id);

res.json({
success:true,
message:"Table Deleted"
});

});