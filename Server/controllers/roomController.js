// controllers/roomController.js
import Room from "../models/roomModel.js";

export const createRoom = async (req, res) => {
    try {
        console.log("Creating room with body:", req.user);
        const userId = req.user._id; // comes from JWT middleware
        const { problemId } = req.body;

        console.log("User ID:", userId);
        console.log("Problem ID:", problemId);

        const room = await Room.create({
            host: userId, // ✅ set host
            problem: problemId,
            participants: [
                { user: userId, joinedAt: new Date() }, // ✅ first participant
            ],
        });

        res.status(201).json({
            success: true,
            data: room,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create room",
            error: error.message,
        });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const userId = req.user._id;
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        await room.addParticipant(userId, req.body.socketId || null);
        const populated = await Room.findById(roomId).populate(
            "participants.user",
            "name photo"
        );
        return res.json(populated);
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ message: err.message });
    }
};

export const leaveRoom = async (req, res) => {
    try {
        const userId = req.user._id;
        const { roomId } = req.params;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        await room.removeParticipant(userId);
        return res.json({ message: "Left room" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

export const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.roomId)
            .populate("host", "name")
            .populate("participants.user", "name photo");
        if (!room) return res.status(404).json({ message: "Room not found" });
        return res.json(room);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};
