export default function setupSocket(io) {
    const roomUsers = {}; // memory map
    io.on("connection", (socket) => {
        // console.log("🔌 User connected:", socket.id);

        socket.on("join-room", ({ roomId, userId, username }) => {
            socket.join(roomId);

            // console.log(`🧑‍💻 Joined room: ${roomId}`);
            // console.log(`User ID: ${userId}, Username: ${username}`);

            // console.log(
            //     "JOIN:",
            //     username,
            //     "Room:",
            //     roomId,
            //     "Socket:",
            //     socket.id
            // );

            // if (!roomUsers[roomId]) roomUsers[roomId] = [];
            // roomUsers[roomId].push({ id: socket.id, userId, username });

            if (!roomUsers[roomId]) roomUsers[roomId] = [];

            const alreadyInRoom = roomUsers[roomId].some(
                (u) => u.userId === userId
            );
            if (!alreadyInRoom) {
                roomUsers[roomId].push({ id: socket.id, userId, username });
            }

            // Broadcast to others in the room (not the newly joined one)
            socket.to(roomId).emit("user-joined", { userId, username });

            io.to(roomId).emit("room-users", roomUsers[roomId]);
        });

        socket.on("code-change", ({ roomId, code }) => {
            socket.to(roomId).emit("receive-code", code);
        });

        socket.on("chat-message", ({ roomId, message, sender }) => {
            const chatPayload = {
                message,
                sender,
                timestamp: new Date().toISOString(),
            };

            // Broadcast to others in room
            socket.to(roomId).emit("chat-message", chatPayload);
        });

        socket.on("typing", ({ roomId, username }) => {
            socket.to(roomId).emit("user-typing", username);
        });

        socket.on("cursor-move", ({ roomId, position, username }) => {
            socket.to(roomId).emit("update-cursor", {
                position,
                username,
                socketId: socket.id,
            });
        });

        socket.on("leave-room", (roomId, username) => {
            socket.leave(roomId);
            console.log(`${username} left room ${roomId}`);

            // Optionally, notify others in the room
            socket.to(roomId).emit("user-left", { username });
        });

        socket.on("disconnect", () => {
            for (const roomId in roomUsers) {
                roomUsers[roomId] = roomUsers[roomId].filter(
                    (u) => u.id !== socket.id
                );
                io.to(roomId).emit("room-users", roomUsers[roomId]);
            }

            for (const [roomId, users] of Object.entries(roomUsers)) {
                const index = users.findIndex((u) => u.socketId === socket.id);
                if (index !== -1) {
                    const [leftUser] = users.splice(index, 1);
                    io.to(roomId).emit("user-left", {
                        username: leftUser.username,
                    });
                }
            }
        });
    });
}
