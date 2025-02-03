# Time-Tracking-Tool

A Fullstack Web application for a time-tracking tool for freelancers.
Authentication and Authorization was implemented using the jwt token and RBAC.

Overview
This tool is designed for freelancers and project managers to efficiently manage project assignments, log working hours, and streamline approvals.
It is built with robust role-based access control, flexible time tracking, and a detailed workflow to ensure transparency and accountability.

Features
Role-Based Access Control: Supports admin, freelancer, and project manager roles.
Time Tracking: Freelancers can log work entries with details like date, hours worked, and descriptions.
Project Management: Projects include descriptions and assigned freelancers for better organization.
Approval Workflow: Managers can review, approve, or reject time entries submitted by freelancers.
Financial Calculation: Automatically calculates total hours and amounts based on the freelancer's hourly rate.
Comments & Feedback: Communication between freelancers and managers is enabled via comments.

User Management and Role-Based Access Control (RBAC)
Middleware
Authentication Middleware (authMiddleware)
Ensures that only authenticated users with valid JWT tokens can access protected routes.

Verifies the JWT token from the Authorization header.
Decodes the token to extract the user ID and role.
Attaches the user information to req.user.
Role-Based Permission Check (checkPermission)
Grants access to specific actions based on the user's role and assigned permissions.

Matches the user's role against the required permissions for the route.
Returns a 403 Forbidden response if the user lacks the required permissions.
Role Validation Middleware (checkRole)
Ensures only users with specific roles (e.g., admin, project_manager) can access certain routes.

Compares the user's role with the allowed roles for the route.
Denies access if the user's role is not among the required roles.
RBAC Configuration
Roles and permissions are defined as follows:

Admin
Grants access to all operations (grants: ["*"]).

Project Manager
Grants access to manage projects, users, and review/approve working hours.
Example permissions:
projects:create
users:edit
hours:approve

Freelancer
Grants access to manage their own working hours and profile.
Example permissions:
users:update_own
hours:create
hours:edit_own

Routes
Register a User
POST /users/register

**Public route to register a new user**
Utilizes userService.createUser.
Login a User
POST /users/login

Authenticates a user and generates a JWT token.
Assign Role to User
PATCH users/:userId/assign-role

Assigns a role to a user.
Example: Change a user's role to project_manager.
Update User
PATCH /users/:userId/assign-role

Middleware: authMiddleware
Allows authenticated users (freelancers, admins, project managers) to update user details.
Delete User
DELETE users/:userId

Middleware: authMiddleware, checkRole(["admin", "project_manager"])
Allows only admin or project_manager roles to delete users.
