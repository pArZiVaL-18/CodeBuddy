import { Submission } from "../models/Submission.js";
import { Problem } from "../models/Problems.js";
import User from "../models/User.js";

const difficultyPoints = {
    Easy: 10,
    Medium: 20,
    Hard: 30,
};

/**
 * Handles both solo and collaborative submissions.
 * @param {Object} data - Submission data
 * @param {Array<string>} data.userIds - One or more user IDs
 * @param {string} data.problemId
 * @param {string} data.code
 * @param {string} data.language
 * @param {string} data.status
 * @param {string} data.output
 * @param {string} data.runtime
 * @param {string} data.memory
 * @param {number} data.testCasesPassed
 * @returns {Promise<Object>} - The saved submission document
 */
export async function handleSubmission(data) {
    const {
        userIds,
        problemId,
        code,
        language,
        status,
        output,
        runtime,
        memory,
        testCasesPassed,
    } = data;

    console.log("Handling submission for users:", userIds);
    console.log("Handling submission for problem:", problemId);

    const problem = await Problem.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    const points = difficultyPoints[problem.difficulty] || 10;

    // Create submission record
    const submission = new Submission({
        users: userIds,
        problem: problemId,
        code,
        language,
        status,
        output,
        runtime,
        memory,
        testCasesPassed,
        pointsAwarded: status === "Accepted" ? points : 0,
    });

    await submission.save();

    // Only update scores if Accepted
    if (status === "Accepted") {
        const unsolvedUsers = [];

        for (const uid of userIds) {
            const alreadySolved = await Submission.exists({
                users: uid,
                problem: problemId,
                status: "Accepted",
                _id: { $ne: submission._id },
            });
            if (!alreadySolved) unsolvedUsers.push(uid);
        }

        if (unsolvedUsers.length > 0) {
            await User.updateMany(
                { _id: { $in: unsolvedUsers } },
                { $inc: { problemSolved: 1, score: points } }
            );
        }
        for (const userId of unsolvedUsers) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { solvedProblems: problemId }, // avoids duplicates
            });
        }
    }

    return submission;
}
