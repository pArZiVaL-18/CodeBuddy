import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import setupSocket from "./socket/socketManager.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);
app.use(express.json());

// DB connection
connectDB();

// API routes
app.use("/api/problems", (await import("./routes/Problem.js")).default);
app.use("/api/auth", (await import("./routes/user.js")).default);
app.use("/api/submit", (await import("./routes/submission.js")).default);
app.use("/api/leaderboard", (await import("./routes/leaderboard.js")).default);
app.use("/api/rooms", (await import("./routes/rootRoutes.js")).default);

// WebSocket setup
setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
