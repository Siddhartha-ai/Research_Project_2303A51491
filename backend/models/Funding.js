const mongoose = require("mongoose");

const fundingSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        source: {
            type: String,
            required: true,
            trim: true
        },

        allocatedAmount: {
            type: Number,
            required: true,
            min: 0
        },

        utilizedAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        utilizationDate: {
            type: Date
        },

        purpose: {
            type: String,
            required: true,
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

module.exports = mongoose.model("Funding", fundingSchema);