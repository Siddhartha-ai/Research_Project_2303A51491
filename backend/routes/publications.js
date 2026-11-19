const express = require("express");
const Publication = require("../models/Publication");
const Project = require("../models/Project");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create a publication or research output
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
                project,
                title,
                type,
                authors,
                venue,
                publicationDate,
                status,
                doiOrPatentNumber,
                description
            } = req.body;

            const existingProject = await Project.findById(project);

            if (!existingProject) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            const publication = await Publication.create({
                project,
                title,
                type,
                authors: authors || [],
                venue,
                publicationDate,
                status,
                doiOrPatentNumber,
                description
            });

            res.status(201).json({
                message: "Research output created successfully",
                publication
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create research output",
                error: error.message
            });
        }
    }
);

// Get all publications and research outputs
router.get(
    "/",
    authenticate,
    async (req, res) => {
        try {
            const publications = await Publication.find()
                .populate("project", "title department")
                .populate("authors", "name email role")
                .sort({ createdAt: -1 });

            res.json(publications);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch research outputs",
                error: error.message
            });
        }
    }
);

// Get research outputs for one project
router.get(
    "/project/:projectId",
    authenticate,
    async (req, res) => {
        try {
            const publications = await Publication.find({
                project: req.params.projectId
            })
                .populate("project", "title")
                .populate("authors", "name email role")
                .sort({ createdAt: -1 });

            res.json(publications);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch project research outputs",
                error: error.message
            });
        }
    }
);

// Update a publication
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
            const publication = await Publication.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!publication) {
                return res.status(404).json({
                    message: "Research output not found"
                });
            }

            res.json({
                message: "Research output updated successfully",
                publication
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update research output",
                error: error.message
            });
        }
    }
);

// Delete a publication
router.delete(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator"
    ),
    async (req, res) => {
        try {
            const publication = await Publication.findByIdAndDelete(
                req.params.id
            );

            if (!publication) {
                return res.status(404).json({
                    message: "Research output not found"
                });
            }

            res.json({
                message: "Research output deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete research output",
                error: error.message
            });
        }
    }
);

module.exports = router;