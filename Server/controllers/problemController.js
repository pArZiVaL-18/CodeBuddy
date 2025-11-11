import { Problem } from "../models/Problems.js";
import User from "../models/User.js";

const getAllProblems = async (req, res) => {
    // const userId = req.user.id;

    const userId = req.query.userId;
    console.log("Fetching problems for user ID:", userId);

    const problems = await Problem.find();
    const user = await User.findById(userId).populate("solvedProblems");

    const solvedIds = user.solvedProblems.map((p) => p._id.toString());

    console.log("Solved problem IDs for user:", solvedIds);
    console.log("Total problems fetched:", problems.length);
    res.json({ problems, solvedIds });

    // res.json(problems);
};

const getProblemById = async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
};

export default {
    getAllProblems,
    getProblemById,
};
