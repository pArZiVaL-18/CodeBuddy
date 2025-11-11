// models/roomModel.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const participantSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        joinedAt: { type: Date, default: Date.now },
        socketId: { type: String, default: null }, // optional for realtime presence
        roomScore: { type: Number, default: 0 }, // per-room points
        solvedCount: { type: Number, default: 0 }, // per-room solved problems
        isReady: { type: Boolean, default: false },
    },
    { _id: false }
);

const problemHistorySchema = new Schema(
    {
        problem: {
            type: Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
        },
        startedAt: Date,
        endedAt: Date,
        solvedBy: [
            { user: { type: Schema.Types.ObjectId, ref: "User" }, at: Date },
        ],
    },
    { _id: false }
);

const roomSchema = new Schema(
    {
        name: { type: String, required: true },
        host: { type: Schema.Types.ObjectId, ref: "User", required: true },
        participants: [participantSchema],
        currentProblem: {
            type: Schema.Types.ObjectId,
            ref: "Problem",
            default: null,
        },
        problemHistory: [problemHistorySchema],
        status: {
            type: String,
            enum: ["open", "in-progress", "closed"],
            default: "open",
        },
        isPrivate: { type: Boolean, default: false },
        maxParticipants: { type: Number, default: 2 },
        settings: {
            timeLimitSeconds: { type: Number, default: 0 },
            pointsForSolve: { type: Number, default: 10 },
        },
    },
    { timestamps: true }
);

// useful indexes
roomSchema.index({ host: 1 });
roomSchema.index({ "participants.user": 1 });
roomSchema.index({ currentProblem: 1 });

// instance helpers
roomSchema.methods.hasParticipant = function (userId) {
    return this.participants.some(
        (p) => p.user.toString() === userId.toString()
    );
};

roomSchema.methods.addParticipant = async function (userId, socketId = null) {
    if (this.hasParticipant(userId)) return this;
    if (this.participants.length >= this.maxParticipants) {
        const err = new Error("Room is full");
        err.status = 403;
        throw err;
    }
    this.participants.push({ user: userId, socketId });
    return this.save();
};

roomSchema.methods.removeParticipant = async function (userId) {
    this.participants = this.participants.filter(
        (p) => p.user.toString() !== userId.toString()
    );
    return this.save();
};

roomSchema.methods.recordRoomSolve = async function (userId, points = null) {
    // increment the per-room counters for a participant
    const p = this.participants.find(
        (x) => x.user.toString() === userId.toString()
    );
    if (!p) {
        const err = new Error("User not in room");
        err.status = 404;
        throw err;
    }
    const pts = points ?? this.settings.pointsForSolve ?? 10;
    p.roomScore += pts;
    p.solvedCount += 1;
    return this.save();
};

const Room = mongoose.model("Room", roomSchema);
export default Room;
