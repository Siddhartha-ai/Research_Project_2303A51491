const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        principalInvestigator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        teamMembers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        fundingAmount: {
            type: Number,
            default: 0
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Planned",
                "Ongoing",
                "Completed",
                "On Hold"
            ],
            default: "Planned"
        },

        progress: {
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

module.exports = mongoose.model("Project", projectSchema);