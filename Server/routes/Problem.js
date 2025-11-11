import express from "express";
import { Problem } from "../models/Problems.js";
import authController from "../controllers/authController.js";
import problemController from "../controllers/problemController.js";

const router = express.Router();

// GET all problems
router.get("/", problemController.getAllProblems);

// GET a problem by ID
router.get("/:id", problemController.getProblemById);

// GET a problem by ID
// router.get("/:id", async (req, res) => {
//     const problem = await Problem.findById(req.params.id);
//     if (!problem) return res.status(404).json({ error: "Problem not found" });
//     res.json(problem);
// });

// POST a new problem (admin or dev use)
router.post("/", async (req, res) => {
    const problem = new Problem(req.body);
    await problem.save();
    res.json(problem);
});

// GET a problem by slug
router.get("/slug/:slug", async (req, res) => {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.json(problem);
});

export default router;
