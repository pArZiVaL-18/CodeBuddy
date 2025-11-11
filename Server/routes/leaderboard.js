import express from "express";
import User from "../models/User.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const leaderboard = await User.find()
            .select("name problemSolved score")
            .sort({ score: -1, problemSolved: -1 })
            .limit(20);

        res.json(leaderboard);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});
export default router;
