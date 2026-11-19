const express = require("express");
const Milestone = require("../models/Milestone");
const Project = require("../models/Project");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create a milestone
router.post(
    "/",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator",
        "Faculty Researcher"
    ),
    async (req, res) => {
        try {
            const {
                project,
                title,
                description,
                dueDate
            } = req.body;

            const existingProject = await Project.findById(project);

            if (!existingProject) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            const milestone = await Milestone.create({
                project,
                title,
                description,
                dueDate
            });

            res.status(201).json({
                message: "Milestone created successfully",
                milestone
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create milestone",
                error: error.message
            });
        }
    }
);

// Get all milestones for a project
router.get(
    "/:projectId",
    authenticate,
    async (req, res) => {
        try {
            const milestones = await Milestone.find({
                project: req.params.projectId
            })
                .populate("project", "title")
                .sort({ dueDate: 1 });

            res.json(milestones);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch milestones",
                error: error.message
            });
        }
    }
);

// Update a milestone
router.put(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator",
        "Faculty Researcher"
    ),
    async (req, res) => {
        try {
            const milestone = await Milestone.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!milestone) {
                return res.status(404).json({
                    message: "Milestone not found"
                });
            }

            res.json({
                message: "Milestone updated successfully",
                milestone
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update milestone",
                error: error.message
            });
        }
    }
);

// Delete a milestone
router.delete(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator"
    ),
    async (req, res) => {
        try {
            const milestone = await Milestone.findByIdAndDelete(
                req.params.id
            );

            if (!milestone) {
                return res.status(404).json({
                    message: "Milestone not found"
                });
            }

            res.json({
                message: "Milestone deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete milestone",
                error: error.message
            });
        }
    }
);

module.exports = router;