\# Research Project and Publication Tracking Management System



\## Project Overview

A full-stack web application for managing academic research projects, milestones, publications, funding, and researcher activities.



\## Technology Stack

\- React.js

\- Node.js

\- Express.js

\- MongoDB

\- JWT Authentication

\- Docker

\- Kubernetes



\## Main Features

\- Role-based login and authorization

\- Research project management

\- Milestone tracking

\- Publication and patent tracking

\- Funding allocation and utilization tracking

\- Research activity tracking

\- Dashboard with project statistics

\- Project Progress Report

\- Publication Register

\- Funding Utilization Report

\- Researcher Activity Report



\## User Roles

\- Admin

\- Research Coordinator

\- Faculty Researcher

\- Student Researcher



\## Architecture

React.js Frontend → Express.js REST API → MongoDB



\## Docker

The React frontend is containerized using Docker and served through Nginx.



Build:

```bash

cd frontend

npm run build

docker build -t research-frontend .

