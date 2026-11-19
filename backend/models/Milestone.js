const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
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

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Completed",
                "Delayed"
            ],
            default: "Pending"
        },

        completionPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Milestone", milestoneSchema);