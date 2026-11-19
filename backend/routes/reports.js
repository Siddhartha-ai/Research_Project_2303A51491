const express = require("express");
const Project = require("../models/Project");
const Publication = require("../models/Publication");
const Funding = require("../models/Funding");
const ResearchActivity = require("../models/ResearchActivity");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Project Progress Report
router.get("/project-progress", authenticate, async (req, res) => {
    try {
        const projects = await Project.find()
            .populate(
                "principalInvestigator",
                "name email role department"
            )
            .populate(
                "teamMembers",
                "name email role department"
            )
            .sort({ createdAt: -1 });

        const report = projects.map((project) => ({
            projectId: project._id,
            title: project.title,
            department: project.department,
            principalInvestigator: project.principalInvestigator,
            teamMembers: project.teamMembers,
            fundingAmount: project.fundingAmount,
            startDate: project.startDate,
            endDate: project.endDate,
            status: project.status,
            progress: project.progress
        }));

        res.json({
            reportName: "Project Progress Report",
            generatedAt: new Date(),
            totalProjects: report.length,
            projects: report
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate project progress report",
            error: error.message
        });
    }
});

// Publication Register
router.get("/publication-register", authenticate, async (req, res) => {
    try {
        const publications = await Publication.find()
            .populate("project", "title department")
            .populate(
                "authors",
                "name email role department"
            )
            .sort({ publicationDate: -1 });

        res.json({
            reportName: "Publication Register",
            generatedAt: new Date(),
            totalOutputs: publications.length,
            publications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate publication register",
            error: error.message
        });
    }
});

// Funding Utilization Report
router.get("/funding-utilization", authenticate, async (req, res) => {
    try {
        const fundingRecords = await Funding.find()
            .populate("project", "title department")
            .sort({ createdAt: -1 });

        const totalAllocated = fundingRecords.reduce(
            (sum, record) => sum + record.allocatedAmount,
            0
        );

        const totalUtilized = fundingRecords.reduce(
            (sum, record) => sum + record.utilizedAmount,
            0
        );

        const remainingAmount =
            totalAllocated - totalUtilized;

        const utilizationPercentage =
            totalAllocated > 0
                ? Number(
                      (
                          (totalUtilized / totalAllocated) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        res.json({
            reportName: "Funding Utilization Report",
            generatedAt: new Date(),
            totalAllocated,
            totalUtilized,
            remainingAmount,
            utilizationPercentage,
            fundingRecords
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate funding utilization report",
            error: error.message
        });
    }
});

// Researcher Activity Report
router.get("/researcher-activity", authenticate, async (req, res) => {
    try {
        const activities = await ResearchActivity.find()
            .populate(
                "researcher",
                "name email role department"
            )
            .populate(
                "project",
                "title department"
            )
            .sort({ activityDate: -1 });

        const activitySummary = {};

        activities.forEach((activity) => {
            if (!activity.researcher) {
                return;
            }

            const researcherId =
                activity.researcher._id.toString();

            if (!activitySummary[researcherId]) {
                activitySummary[researcherId] = {
                    researcher: activity.researcher,
                    totalActivities: 0,
                    completedActivities: 0,
                    activities: []
                };
            }

            activitySummary[researcherId].totalActivities += 1;

            if (activity.status === "Completed") {
                activitySummary[researcherId].completedActivities += 1;
            }

            activitySummary[researcherId].activities.push(activity);
        });

        res.json({
            reportName: "Researcher Activity Report",
            generatedAt: new Date(),
            totalActivities: activities.length,
            researcherCount: Object.keys(activitySummary).length,
            researchers: Object.values(activitySummary)
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate researcher activity report",
            error: error.message
        });
    }
});

module.exports = router;