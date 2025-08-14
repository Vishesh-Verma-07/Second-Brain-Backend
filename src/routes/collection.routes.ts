import express from "express";
import { createCollection, getCollections, getCollectionById, updateCollection, deleteCollection } from "../controller/collection.controller";
import { auth } from "../middlewares/middleware"; // Assuming you have an auth middleware

const router = express.Router();

// Apply authentication middleware to all collection routes
router.use(auth);

// Collection routes
router.post("/createCollection", createCollection);
router.get("/getCollections", getCollections);
router.get("/getCollectionById/:id", getCollectionById);
router.put("/updateCollection/:id", updateCollection);
router.delete("/deleteCollection/:id", deleteCollection);

export default router;
