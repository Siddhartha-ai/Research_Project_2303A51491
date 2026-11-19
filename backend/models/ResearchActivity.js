const mongoose = require("mongoose");

const researchActivitySchema = new mongoose.Schema(
    {
        researcher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        activityType: {
            type: String,
            enum: [
                "Research Work",
                "Milestone Update",
                "Publication",
                "Conference",
                "Patent",
                "Presentation",
                "Other"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        activityDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Planned",
                "In Progress",
                "Completed"
            ],
            default: "Completed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ResearchActivity",
    researchActivitySchema
);