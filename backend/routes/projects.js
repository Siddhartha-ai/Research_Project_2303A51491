const express = require("express");
const Project = require("../models/Project");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create a research project
router.post(
    "/",
    authenticate,
    authorize("Admin", "Research Coordinator", "Faculty Researcher"),
    async (req, res) => {
        try {
            const {
                title,
                description,
                department,
                teamMembers,
                fundingAmount,
                startDate,
                endDate
            } = req.body;

            const project = await Project.create({
                title,
                description,
                department,
                principalInvestigator: req.user.id,
                teamMembers: teamMembers || [],
                fundingAmount: fundingAmount || 0,
                startDate,
                endDate
            });

            res.status(201).json({
                message: "Research project created successfully",
                project
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create research project",
                error: error.message
            });
        }
    }
);

// Get all research projects
router.get(
    "/",
    authenticate,
    async (req, res) => {
        try {
            const projects = await Project.find()
                .populate("principalInvestigator", "name email role")
                .populate("teamMembers", "name email role")
                .sort({ createdAt: -1 });

            res.json(projects);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch research projects",
                error: error.message
            });
        }
    }
);

// Get one research project
router.get(
    "/:id",
    authenticate,
    async (req, res) => {
        try {
            const project = await Project.findById(req.params.id)
                .populate("principalInvestigator", "name email role")
                .populate("teamMembers", "name email role");

            if (!project) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            res.json(project);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch research project",
                error: error.message
            });
        }
    }
);

// Update a research project
router.put(
    "/:id",
    authenticate,
    authorize("Admin", "Research Coordinator", "Faculty Researcher"),
    async (req, res) => {
        try {
            const project = await Project.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!project) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            res.json({
                message: "Research project updated successfully",
                project
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update research project",
                error: error.message
            });
        }
    }
);

// Delete a research project
router.delete(
    "/:id",
    authenticate,
    authorize("Admin", "Research Coordinator"),
    async (req, res) => {
        try {
            const project = await Project.findByIdAndDelete(req.params.id);

            if (!project) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            res.json({
                message: "Research project deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete research project",
                error: error.message
            });
        }
    }
);

module.exports = router;