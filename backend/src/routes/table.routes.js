import express from "express";

import {
createTable,
getTables,
updateTable,
deleteTable
} from "../controllers/table.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protect,createTable);

router.get("/",protect,getTables);

router.put("/:id",protect,updateTable);

router.delete("/:id",protect,deleteTable);

export default router;