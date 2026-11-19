const express = require("express");
const Project = require("../models/Project");
const Publication = require("../models/Publication");
const Funding = require("../models/Funding");
const ResearchActivity = require("../models/ResearchActivity");
const Milestone = require("../models/Milestone");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Dashboard summary
router.get("/", authenticate, async (req, res) => {
    try {
        const [
            totalProjects,
            ongoingProjects,
            completedProjects,
            totalPublications,
            totalActivities,
            totalMilestones,
            fundingRecords,
            recentProjects,
            recentPublications
        ] = await Promise.all([
            Project.countDocuments(),

            Project.countDocuments({
                status: "Ongoing"
            }),

            Project.countDocuments({
                status: "Completed"
            }),

            Publication.countDocuments(),

            ResearchActivity.countDocuments(),

            Milestone.countDocuments(),

            Funding.find(),

            Project.find()
                .select(
                    "title department status progress startDate endDate"
                )
                .sort({ createdAt: -1 })
                .limit(5),

            Publication.find()
                .populate("project", "title department")
                .select(
                    "title type status publicationDate venue"
                )
                .sort({ createdAt: -1 })
                .limit(5)
        ]);

        const totalAllocated = fundingRecords.reduce(
            (sum, record) =>
                sum + record.allocatedAmount,
            0
        );

        const totalUtilized = fundingRecords.reduce(
            (sum, record) =>
                sum + record.utilizedAmount,
            0
        );

        const remainingFunding =
            totalAllocated - totalUtilized;

        const fundingUtilizationPercentage =
            totalAllocated > 0
                ? Number(
                      (
                          (totalUtilized /
                              totalAllocated) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        res.json({
            summary: {
                totalProjects,
                ongoingProjects,
                completedProjects,
                totalPublications,
                totalActivities,
                totalMilestones,
                totalAllocated,
                totalUtilized,
                remainingFunding,
                fundingUtilizationPercentage
            },

            recentProjects,

            recentPublications,

            generatedAt: new Date()
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load dashboard data",
            error: error.message
        });
    }
});

module.exports = router;