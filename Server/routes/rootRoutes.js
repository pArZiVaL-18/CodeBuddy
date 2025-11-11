// routes/roomRoutes.js
import express from "express";
import {
    createRoom,
    joinRoom,
    leaveRoom,
    getRoom,
} from "../controllers/roomController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/", createRoom); // create a room
router.post("/:roomId/join", joinRoom); // join a room
router.post("/:roomId/leave", leaveRoom);
router.get("/:roomId", getRoom);

export default router;
