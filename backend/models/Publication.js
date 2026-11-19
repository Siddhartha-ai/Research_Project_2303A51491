const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
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

        type: {
            type: String,
            enum: [
                "Journal",
                "Conference",
                "Patent",
                "Book Chapter",
                "Other"
            ],
            required: true
        },

        authors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        venue: {
            type: String,
            trim: true
        },

        publicationDate: {
            type: Date
        },

        status: {
            type: String,
            enum: [
                "Draft",
                "Submitted",
                "Under Review",
                "Accepted",
                "Published",
                "Granted",
                "Rejected"
            ],
            default: "Draft"
        },

        doiOrPatentNumber: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Publication", publicationSchema);