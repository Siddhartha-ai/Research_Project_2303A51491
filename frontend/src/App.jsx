import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";
import "./App.css";

function Layout({ children }) {
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/projects", label: "Research Projects" },
        { path: "/milestones", label: "Milestones" },
        { path: "/publications", label: "Publications" },
        { path: "/funding", label: "Funding" },
        { path: "/activities", label: "Activities" },
        { path: "/reports", label: "Reports" }
    ];

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="brand">
                    <h2>ResearchHub</h2>
                    <p>Research Management</p>
                </div>

                <nav>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={
                                location.pathname === item.path
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <Link to="/login" className="logout-link">
                        Logout
                    </Link>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <h1>Research Project Management</h1>
                        <p>Track projects, publications, funding and research activities.</p>
                    </div>

                    <div className="user-badge">
                        Admin
                    </div>
                </header>

                <section className="page-content">
                    {children}
                </section>
            </main>
        </div>
    );
}

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>ResearchHub</h1>

                <p>
                    Research Project and Publication Tracking
                    Management System
                </p>

                <form onSubmit={handleLogin}>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Enter your email"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        required
                    />

                    {error && (
                        <div
                            style={{
                                color: "#dc2626",
                                marginTop: "5px",
                                marginBottom: "5px",
                                fontSize: "14px"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
function Dashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setData(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard data."
                );
            }
        };

        loadDashboard();
    }, []);

    if (error) {
        return (
            <Layout>
                <div className="content-card">
                    <h3>Dashboard Error</h3>
                    <p>{error}</p>
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="content-card">
                    <h3>Loading dashboard...</h3>
                </div>
            </Layout>
        );
    }

    const { summary, recentProjects } = data;

    return (
        <Layout>
            <div className="page-heading">
                <h2>Dashboard</h2>
                <p>
                    Overview of research activities and project performance.
                </p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span>Total Projects</span>
                    <strong>{summary.totalProjects}</strong>
                </div>

                <div className="stat-card">
                    <span>Publications</span>
                    <strong>{summary.totalPublications}</strong>
                </div>

                <div className="stat-card">
                    <span>Activities</span>
                    <strong>{summary.totalActivities}</strong>
                </div>

                <div className="stat-card">
                    <span>Funding Utilization</span>
                    <strong>
                        {summary.fundingUtilizationPercentage}%
                    </strong>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="content-card">
                    <h3>Recent Research Projects</h3>

                    {recentProjects.length === 0 ? (
                        <p>No research projects found.</p>
                    ) : (
                        recentProjects.map((project) => (
                            <div
                                className="project-row"
                                key={project._id}
                            >
                                <div>
                                    <strong>{project.title}</strong>
                                    <p>{project.department}</p>
                                </div>

                                <span className="status planned">
                                    {project.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <div className="content-card">
                    <h3>Funding Overview</h3>

                    <div className="funding-number">
                        ₹{summary.totalAllocated.toLocaleString("en-IN")}
                    </div>

                    <p>Total allocated funding</p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${summary.fundingUtilizationPercentage}%`
                            }}
                        ></div>
                    </div>

                    <small>
                        ₹{summary.totalUtilized.toLocaleString("en-IN")}
                        {" "}utilized
                    </small>
                </div>
            </div>
        </Layout>
    );
}

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/projects",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProjects(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load research projects."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return (
        <Layout>
            <div className="page-heading">
                <h2>Research Projects</h2>
                <p>
                    Manage research projects, teams, timelines and progress.
                </p>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Projects</h3>
                    <button>Add Project</button>
                </div>

                {loading && <p>Loading projects...</p>}

                {error && (
                    <p style={{ color: "#dc2626" }}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Department</th>
                                    <th>Principal Investigator</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>

                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No research projects found.
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((project) => (
                                        <tr key={project._id}>
                                            <td>
                                                <strong>
                                                    {project.title}
                                                </strong>
                                            </td>

                                            <td>
                                                {project.department}
                                            </td>

                                            <td>
                                                {project.principalInvestigator?.name ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                <span className="status planned">
                                                    {project.status}
                                                </span>
                                            </td>

                                            <td>
                                                {project.progress}%
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

function Milestones() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/projects",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProjects(response.data);

                if (response.data.length > 0) {
                    setSelectedProject(response.data[0]._id);
                }
            } catch (error) {
                setError("Failed to load projects.");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    useEffect(() => {
        if (!selectedProject) {
            return;
        }

        const loadMilestones = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:5000/api/milestones/${selectedProject}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMilestones(response.data);
            } catch (error) {
                setError("Failed to load milestones.");
            }
        };

        loadMilestones();
    }, [selectedProject]);

    return (
        <Layout>
            <div className="page-heading">
                <h2>Milestones</h2>
                <p>
                    Track project milestones and completion status.
                </p>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Project Milestones</h3>

                    <select
                        value={selectedProject}
                        onChange={(event) =>
                            setSelectedProject(event.target.value)
                        }
                        style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #d1d5db"
                        }}
                    >
                        {projects.map((project) => (
                            <option
                                key={project._id}
                                value={project._id}
                            >
                                {project.title}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <p>Loading milestones...</p>}

                {error && (
                    <p style={{ color: "#dc2626" }}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Milestone</th>
                                    <th>Description</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                    <th>Completion</th>
                                </tr>
                            </thead>

                            <tbody>
                                {milestones.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No milestones found.
                                        </td>
                                    </tr>
                                ) : (
                                    milestones.map((milestone) => (
                                        <tr key={milestone._id}>
                                            <td>
                                                <strong>
                                                    {milestone.title}
                                                </strong>
                                            </td>

                                            <td>
                                                {milestone.description ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {new Date(
                                                    milestone.dueDate
                                                ).toLocaleDateString("en-IN")}
                                            </td>

                                            <td>
                                                {milestone.status}
                                            </td>

                                            <td>
                                                {milestone.completionPercentage}%
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

function Publications() {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPublications = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/publications",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setPublications(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load publications."
                );
            } finally {
                setLoading(false);
            }
        };

        loadPublications();
    }, []);

    return (
        <Layout>
            <div className="page-heading">
                <h2>Publications & Research Outputs</h2>
                <p>
                    Track journals, conferences, patents and other outputs.
                </p>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Publication Register</h3>
                    <button>Add Publication</button>
                </div>

                {loading && <p>Loading publications...</p>}

                {error && (
                    <p style={{ color: "#dc2626" }}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Project</th>
                                    <th>Venue</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {publications.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No publications found.
                                        </td>
                                    </tr>
                                ) : (
                                    publications.map((publication) => (
                                        <tr key={publication._id}>
                                            <td>
                                                <strong>
                                                    {publication.title}
                                                </strong>
                                            </td>

                                            <td>
                                                {publication.type}
                                            </td>

                                            <td>
                                                {publication.project?.title ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {publication.venue || "N/A"}
                                            </td>

                                            <td>
                                                {publication.status}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
function Funding() {
    const [fundingRecords, setFundingRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadFunding = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/funding",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setFundingRecords(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load funding records."
                );
            } finally {
                setLoading(false);
            }
        };

        loadFunding();
    }, []);

    const totalAllocated = fundingRecords.reduce(
        (sum, record) => sum + record.allocatedAmount,
        0
    );

    const totalUtilized = fundingRecords.reduce(
        (sum, record) => sum + record.utilizedAmount,
        0
    );

    const remaining = totalAllocated - totalUtilized;

    const utilization =
        totalAllocated > 0
            ? ((totalUtilized / totalAllocated) * 100).toFixed(2)
            : 0;

    return (
        <Layout>
            <div className="page-heading">
                <h2>Funding</h2>
                <p>
                    Monitor research funding allocation and utilization.
                </p>
            </div>

            {loading && (
                <div className="content-card">
                    <p>Loading funding records...</p>
                </div>
            )}

            {error && (
                <div className="content-card">
                    <p style={{ color: "#dc2626" }}>{error}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span>Total Allocated</span>
                            <strong>
                                ₹{totalAllocated.toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="stat-card">
                            <span>Total Utilized</span>
                            <strong>
                                ₹{totalUtilized.toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="stat-card">
                            <span>Remaining</span>
                            <strong>
                                ₹{remaining.toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="stat-card">
                            <span>Utilization</span>
                            <strong>{utilization}%</strong>
                        </div>
                    </div>

                    <div className="content-card">
                        <div className="card-header">
                            <h3>Funding Records</h3>
                            <button>Add Funding</button>
                        </div>

                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Source</th>
                                        <th>Purpose</th>
                                        <th>Allocated</th>
                                        <th>Utilized</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {fundingRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                No funding records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        fundingRecords.map((record) => (
                                            <tr key={record._id}>
                                                <td>
                                                    {record.project?.title ||
                                                        "N/A"}
                                                </td>

                                                <td>
                                                    {record.source}
                                                </td>

                                                <td>
                                                    {record.purpose}
                                                </td>

                                                <td>
                                                    ₹
                                                    {record.allocatedAmount.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>

                                                <td>
                                                    ₹
                                                    {record.utilizedAmount.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    );
}

function Activities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadActivities = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/activities",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setActivities(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load research activities."
                );
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, []);

    return (
        <Layout>
            <div className="page-heading">
                <h2>Research Activities</h2>
                <p>
                    Monitor researcher-wise activities and contributions.
                </p>
            </div>

            <div className="content-card">
                <div className="card-header">
                    <h3>Activity Register</h3>
                    <button>Add Activity</button>
                </div>

                {loading && <p>Loading activities...</p>}

                {error && (
                    <p style={{ color: "#dc2626" }}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Researcher</th>
                                    <th>Project</th>
                                    <th>Activity</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {activities.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">
                                            No research activities found.
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((activity) => (
                                        <tr key={activity._id}>
                                            <td>
                                                {activity.researcher?.name ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {activity.project?.title ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                <strong>
                                                    {activity.title}
                                                </strong>
                                            </td>

                                            <td>
                                                {activity.activityType}
                                            </td>

                                            <td>
                                                {new Date(
                                                    activity.activityDate
                                                ).toLocaleDateString("en-IN")}
                                            </td>

                                            <td>
                                                <span className="status completed">
                                                    {activity.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}

function Reports() {
    const [report, setReport] = useState(null);
    const [activeReport, setActiveReport] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const reportOptions = [
        {
            key: "project-progress",
            title: "Project Progress Report",
            description: "View project timelines, status and progress."
        },
        {
            key: "publication-register",
            title: "Publication Register",
            description: "View all research publications and outputs."
        },
        {
            key: "funding-utilization",
            title: "Funding Utilization Report",
            description: "Review allocated and utilized research funds."
        },
        {
            key: "researcher-activity",
            title: "Researcher Activity Report",
            description: "Review researcher-wise research activities."
        }
    ];

    const loadReport = async (reportKey) => {
        try {
            setLoading(true);
            setError("");
            setActiveReport(reportKey);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/reports/${reportKey}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setReport(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load report."
            );
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="page-heading">
                <h2>Reports</h2>
                <p>
                    Generate and review research management reports.
                </p>
            </div>

            <div className="report-grid">
                {reportOptions.map((item) => (
                    <div className="content-card" key={item.key}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>

                        <button
                            onClick={() =>
                                loadReport(item.key)
                            }
                        >
                            View Report
                        </button>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="content-card">
                    <h3>Loading report...</h3>
                </div>
            )}

            {error && (
                <div className="content-card">
                    <p style={{ color: "#dc2626" }}>
                        {error}
                    </p>
                </div>
            )}

            {!loading && report && (
                <div className="content-card">
                    <div className="card-header">
                        <h3>{report.reportName}</h3>

                        <button
                            onClick={() => window.print()}
                        >
                            Print Report
                        </button>
                    </div>

                    <p>
                        Generated:{" "}
                        {new Date(
                            report.generatedAt
                        ).toLocaleString("en-IN")}
                    </p>

                    {activeReport === "project-progress" && (
                        <>
                            <p>
                                Total Projects:{" "}
                                <strong>
                                    {report.totalProjects}
                                </strong>
                            </p>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Project</th>
                                            <th>Department</th>
                                            <th>Status</th>
                                            <th>Progress</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {report.projects.map(
                                            (project) => (
                                                <tr
                                                    key={
                                                        project.projectId
                                                    }
                                                >
                                                    <td>
                                                        {project.title}
                                                    </td>
                                                    <td>
                                                        {project.department}
                                                    </td>
                                                    <td>
                                                        {project.status}
                                                    </td>
                                                    <td>
                                                        {project.progress}%
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeReport === "publication-register" && (
                        <>
                            <p>
                                Total Outputs:{" "}
                                <strong>
                                    {report.totalOutputs}
                                </strong>
                            </p>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Project</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {report.publications.map(
                                            (publication) => (
                                                <tr
                                                    key={
                                                        publication._id
                                                    }
                                                >
                                                    <td>
                                                        {publication.title}
                                                    </td>
                                                    <td>
                                                        {publication.type}
                                                    </td>
                                                    <td>
                                                        {publication.project?.title ||
                                                            "N/A"}
                                                    </td>
                                                    <td>
                                                        {publication.status}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeReport === "funding-utilization" && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <span>
                                        Total Allocated
                                    </span>
                                    <strong>
                                        ₹
                                        {report.totalAllocated.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span>
                                        Total Utilized
                                    </span>
                                    <strong>
                                        ₹
                                        {report.totalUtilized.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span>
                                        Remaining
                                    </span>
                                    <strong>
                                        ₹
                                        {report.remainingAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span>
                                        Utilization
                                    </span>
                                    <strong>
                                        {report.utilizationPercentage}%
                                    </strong>
                                </div>
                            </div>
                        </>
                    )}

                    {activeReport === "researcher-activity" && (
                        <>
                            <p>
                                Total Activities:{" "}
                                <strong>
                                    {report.totalActivities}
                                </strong>
                            </p>

                            <p>
                                Researchers:{" "}
                                <strong>
                                    {report.researcherCount}
                                </strong>
                            </p>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Researcher</th>
                                            <th>Department</th>
                                            <th>Total Activities</th>
                                            <th>Completed</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {report.researchers.map(
                                            (researcher) => (
                                                <tr
                                                    key={
                                                        researcher.researcher._id
                                                    }
                                                >
                                                    <td>
                                                        {
                                                            researcher
                                                                .researcher
                                                                .name
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            researcher
                                                                .researcher
                                                                .department
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            researcher.totalActivities
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            researcher.completedActivities
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </Layout>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/milestones" element={<Milestones />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/funding" element={<Funding />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;