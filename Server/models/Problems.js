import mongoose from "mongoose";

// Subschema for examples
const exampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        default: "",
    },
});

// Subschema for starter code per language
const starterCodeSchema = new mongoose.Schema({
    judge0Id: {
        type: String,
        required: true,
    },
    starterCode: {
        type: String,
        required: true,
    },
});

// Main Problem schema
const ProblemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true, // e.g., "two-sum"
        },
        description: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        examples: {
            type: [exampleSchema],
            default: [],
        },
        constraints: {
            type: [String],
            default: [],
        },
        starterCode: {
            type: [starterCodeSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const Problem = mongoose.model("Problem", ProblemSchema);
export { Problem };
