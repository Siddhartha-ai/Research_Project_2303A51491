const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const projectRoutes = require("./routes/projects");
const milestoneRoutes = require("./routes/milestones");
const publicationRoutes = require("./routes/publications");
const fundingRoutes = require("./routes/funding");
const activityRoutes = require("./routes/activities");
const reportRoutes = require("./routes/reports");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/funding", fundingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.json({
        message: "Research Project and Publication Tracking Management System API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});