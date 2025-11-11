import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        enum: [
            "c",
            "cpp",
            "java",
            "python",
            "javascript",
            "csharp",
            "go",
            "php",
            "ruby",
            "swift",
            "r",
            "bash",
            "sql",
        ],
        required: true,
    },
    status: {
        type: String,
        enum: [
            "Accepted",
            "Wrong Answer",
            "Runtime Error",
            "Time Limit Exceeded",
            "Compilation Error",
            "Pending",
        ],
        default: "Pending",
    },
    output: {
        type: String,
    },
    runtime: {
        type: Number, // in ms
    },
    memory: {
        type: Number, // in KB/MB
    },
    testCasesPassed: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default: 0,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const Submission = mongoose.model("Submission", submissionSchema);
// module.exports = Submission;
// export default Submission;

export { Submission };
