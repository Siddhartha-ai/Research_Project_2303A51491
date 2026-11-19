const express = require("express");
const Funding = require("../models/Funding");
const Project = require("../models/Project");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Create a funding record
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
                source,
                allocatedAmount,
                utilizedAmount,
                utilizationDate,
                purpose,
                description
            } = req.body;

            const existingProject = await Project.findById(project);

            if (!existingProject) {
                return res.status(404).json({
                    message: "Research project not found"
                });
            }

            if (utilizedAmount > allocatedAmount) {
                return res.status(400).json({
                    message: "Utilized amount cannot exceed allocated amount"
                });
            }

            const funding = await Funding.create({
                project,
                source,
                allocatedAmount,
                utilizedAmount: utilizedAmount || 0,
                utilizationDate,
                purpose,
                description
            });

            res.status(201).json({
                message: "Funding record created successfully",
                funding
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to create funding record",
                error: error.message
            });
        }
    }
);

// Get all funding records
router.get(
    "/",
    authenticate,
    authorize("Admin", "Research Coordinator", "Faculty Researcher"),
    async (req, res) => {
        try {
            const fundingRecords = await Funding.find()
                .populate("project", "title department")
                .sort({ createdAt: -1 });

            res.json(fundingRecords);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch funding records",
                error: error.message
            });
        }
    }
);

// Get funding records for a project
router.get(
    "/project/:projectId",
    authenticate,
    authorize("Admin", "Research Coordinator", "Faculty Researcher"),
    async (req, res) => {
        try {
            const fundingRecords = await Funding.find({
                project: req.params.projectId
            })
                .populate("project", "title department")
                .sort({ createdAt: -1 });

            res.json(fundingRecords);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch project funding records",
                error: error.message
            });
        }
    }
);

// Update a funding record
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
            const funding = await Funding.findById(req.params.id);

            if (!funding) {
                return res.status(404).json({
                    message: "Funding record not found"
                });
            }

            const allocatedAmount =
                req.body.allocatedAmount ?? funding.allocatedAmount;

            const utilizedAmount =
                req.body.utilizedAmount ?? funding.utilizedAmount;

            if (utilizedAmount > allocatedAmount) {
                return res.status(400).json({
                    message: "Utilized amount cannot exceed allocated amount"
                });
            }

            Object.assign(funding, req.body);

            await funding.save();

            res.json({
                message: "Funding record updated successfully",
                funding
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update funding record",
                error: error.message
            });
        }
    }
);

// Delete a funding record
router.delete(
    "/:id",
    authenticate,
    authorize(
        "Admin",
        "Research Coordinator"
    ),
    async (req, res) => {
        try {
            const funding = await Funding.findByIdAndDelete(
                req.params.id
            );

            if (!funding) {
                return res.status(404).json({
                    message: "Funding record not found"
                });
            }

            res.json({
                message: "Funding record deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete funding record",
                error: error.message
            });
        }
    }
);

module.exports = router;