import express from "express";
const router = express.Router();
import { handleSubmission } from "../utils/handleSubmission.js";

router.post("/", async (req, res) => {
    try {
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
        } = req.body;

        // console.log("Solo submission for users:", userIds);
        // console.log("Problem ID:", problemId);

        const submission = await handleSubmission({
            userIds, // ✅ even solo handled as an array
            problemId,
            code,
            language,
            status,
            output,
            runtime,
            memory,
            testCasesPassed,
        });

        res.status(201).json(submission);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Submission failed" });
    }
});

router.post("/collab", async (req, res) => {
    try {
        const {
            userIds, // array of user IDs
            problemId,
            code,
            language,
            status,
            output,
            runtime,
            memory,
            testCasesPassed,
        } = req.body;

        console.log("Collaborative submission for users:", userIds);
        console.log("Problem ID:", problemId);

        const submission = await handleSubmission({
            userIds,
            problemId,
            code,
            language,
            status,
            output,
            runtime,
            memory,
            testCasesPassed,
        });

        res.status(201).json({
            message: "Collaborative submission saved successfully",
            submission,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message || "Collaborative submission failed",
        });
    }
});

// const difficultyPoints = {
//     Easy: 10,
//     Medium: 20,
//     Hard: 30,
// };

// router.post("/", async (req, res) => {
//     try {
//         const {
//             userId,
//             problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//         } = req.body;

//         const problem = await Problem.findById(problemId);
//         if (!problem)
//             return res.status(404).json({ error: "Problem not found" });

//         // Check if already solved
//         const alreadySolved = await Submission.exists({
//             user: userId,
//             problem: problemId,
//             status: "Accepted",
//         });

//         if (status === "Accepted" && alreadySolved) {
//             return res
//                 .status(200)
//                 .json({ message: "Already solved — no score updated" });
//         }

//         // Save submission
//         const newSubmission = new Submission({
//             users: userId,
//             problem: problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//             pointsAwarded:
//                 status === "Accepted"
//                     ? difficultyPoints[problem.difficulty] || 10
//                     : 0,
//         });

//         await newSubmission.save();

//         // Update user score if first successful submission
//         if (status === "Accepted" && !alreadySolved) {
//             const points = difficultyPoints[problem.difficulty] || 10;
//             await User.findByIdAndUpdate(userId, {
//                 $inc: { problemSolved: 1, score: points },
//             });
//         }

//         res.status(201).json(newSubmission);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to save submission" });
//     }
// });

// router.post("/collab", async (req, res) => {
//     try {
//         const {
//             userIds, // Array of ObjectIds: [user1, user2, ...]
//             problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//         } = req.body;

//         const problem = await Problem.findById(problemId);
//         if (!problem)
//             return res.status(404).json({ error: "Problem not found" });

//         // If not accepted, just save without score update
//         if (status !== "Accepted") {
//             const submission = await Submission.create({
//                 users: userIds,
//                 problem: problemId,
//                 code,
//                 language,
//                 status,
//                 output,
//                 runtime,
//                 memory,
//                 testCasesPassed,
//                 pointsAwarded: 0,
//             });
//             return res.status(201).json(submission);
//         }

//         // Filter out users who already solved this problem
//         const unsolvedUsers = [];
//         for (const uid of userIds) {
//             const alreadySolved = await Submission.exists({
//                 users: uid,
//                 problem: problemId,
//                 status: "Accepted",
//             });
//             if (!alreadySolved) unsolvedUsers.push(uid);
//         }

//         // Award points to only those unsolved users
//         const points = difficultyPoints[problem.difficulty] || 10;
//         if (unsolvedUsers.length > 0) {
//             await User.updateMany(
//                 { _id: { $in: unsolvedUsers } },
//                 { $inc: { problemSolved: 1, score: points } }
//             );
//         }

//         // Save the shared submission
//         const newSubmission = new Submission({
//             users: userIds,
//             problem: problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//             pointsAwarded: points,
//         });

//         await newSubmission.save();
//         res.status(201).json({
//             message: `Collaborative submission saved. ${unsolvedUsers.length} users gained points.`,
//             submission: newSubmission,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             error: "Failed to save collaborative submission",
//         });
//     }
// });

// ----------------------------------------------------------------------------------------------------------------------

// router.post("/", async (req, res) => {
//     try {
//         const {
//             userId,
//             problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//         } = req.body;

//         const newSubmission = new Submission({
//             user: userId,
//             problem: problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//         });

//         await newSubmission.save();

//         // ✅ Update user score if Accepted and not solved before
//         if (status === "Accepted") {
//             const alreadySolved = await Submission.exists({
//                 user: userId,
//                 problem: problemId,
//                 status: "Accepted",
//                 _id: { $ne: newSubmission._id },
//             });

//             if (!alreadySolved) {
//                 const problem = await Problem.findById(problemId);
//                 const points = difficultyPoints[problem.difficulty] || 10;

//                 // Update both counters
//                 await User.findByIdAndUpdate(userId, {
//                     $inc: { problemSolved: 1, score: points },
//                 });
//                 await newSubmission.save();
//             }
//         }

//         res.status(201).json(newSubmission);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to save submission" });
//     }
// });

// // POST /api/submissions
// router.post("/", async (req, res) => {
//     try {
//         const {
//             userId,
//             problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//             score,
//         } = req.body;

//         const newSubmission = new Submission({
//             user: userId,
//             problem: problemId,
//             code,
//             language,
//             status,
//             output,
//             runtime,
//             memory,
//             testCasesPassed,
//             score,
//         });

//         // If Accepted, check if user has already solved this problem
//         if (status === "Accepted") {
//             const alreadySolved = await Submission.exists({
//                 user: userId,
//                 problem: problemId,
//                 status: "Accepted",
//                 _id: { $ne: newSubmission._id }, // exclude current submission
//             });
//             // console.log("Already solved:", alreadySolved);

//             if (status === "Accepted" && !alreadySolved) {
//                 const problem = await Problem.findById(problemId);
//                 let points = 0;
//                 if (problem.difficulty === "Easy") {
//                     points = 10;
//                 } else if (problem.difficulty === "Medium") {
//                     points = 20;
//                 } else if (problem.difficulty === "Hard") {
//                     points = 30;
//                 }
//                 await User.findByIdAndUpdate(userId, {
//                     $inc: { problemSolved: 1, score: points },
//                 });
//             }
//         }

//         res.status(201).json(newSubmission);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Failed to save submission" });
//     }
// });

export default router;
