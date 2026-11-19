const express = require("express");
const ResearchActivity = require("../models/ResearchActivity");
const Project = require("../models/Project");
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create a research activity
router.post(
    "/",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator",
        "Faculty Researcher",
        "Student Researcher"
    ),
    async (req, res) => {
        try {
            const {
                researcher,
                project,
                activityType,
                title,
                description,
                activityDate,
                status
            } = req.body;

            const existingResearcher = await User.findById(researcher);

            if (!existingResearcher) {
                return res.status(404).json({
                    message: "Researcher not found"
                });
            }

            const existingProject = await Project.findById(project);

            if (!existingProject) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            const activity = await ResearchActivity.create({
                researcher,
                project,
                activityType,
                title,
                description,
                activityDate,
                status
            });

            res.status(201).json({
                message: "Research activity created successfully",
                activity
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create research activity",
                error: error.message
            });
        }
    }
);

// Get all research activities
router.get(
    "/",
    authenticate,
    async (req, res) => {
        try {
            const activities = await ResearchActivity.find()
                .populate("researcher", "name email role department")
                .populate("project", "title department")
                .sort({ activityDate: -1 });

            res.json(activities);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch research activities",
                error: error.message
            });
        }
    }
);

// Get activities for one researcher
router.get(
    "/researcher/:researcherId",
    authenticate,
    async (req, res) => {
        try {
            const activities = await ResearchActivity.find({
                researcher: req.params.researcherId
            })
                .populate("researcher", "name email role department")
                .populate("project", "title department")
                .sort({ activityDate: -1 });

            res.json(activities);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch researcher activities",
                error: error.message
            });
        }
    }
);

// Update a research activity
router.put(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator",
        "Faculty Researcher",
        "Student Researcher"
    ),
    async (req, res) => {
        try {
            const activity = await ResearchActivity.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!activity) {
                return res.status(404).json({
                    message: "Research activity not found"
                });
            }

            res.json({
                message: "Research activity updated successfully",
                activity
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update research activity",
                error: error.message
            });
        }
    }
);

// Delete a research activity
router.delete(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator"
    ),
    async (req, res) => {
        try {
            const activity = await ResearchActivity.findByIdAndDelete(
                req.params.id
            );

            if (!activity) {
                return res.status(404).json({
                    message: "Research activity not found"
                });
            }

            res.json({
                message: "Research activity deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete research activity",
                error: error.message
            });
        }
    }
);

module.exports = router;