/**
 * @openapi
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64c7f123b0d2b8c5c8d1e7f3"
 *         teamId:
 *           type: string
 *           example: "64c7f0a0b0d2b8c5c8d1e7f2"
 *         name:
 *           type: string
 *           example: "Website Redesign"
 *         description:
 *           type: string
 *           example: "UI/UX overhaul and backend optimization"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-13T09:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-13T09:45:00.000Z"
 */

/**
 * @openapi
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *               - name
 *             properties:
 *               teamId:
 *                 type: string
 *                 example: "64c7f0a0b0d2b8c5c8d1e7f2"
 *               name:
 *                 type: string
 *                 example: "Website Redesign"
 *               description:
 *                 type: string
 *                 example: "UI/UX overhaul and backend optimization"
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Project created successfully"
 *               project:
 *                 _id: "64c7f123b0d2b8c5c8d1e7f3"
 *                 teamId: "64c7f0a0b0d2b8c5c8d1e7f2"
 *                 name: "Website Redesign"
 *                 description: "UI/UX overhaul and backend optimization"
 *                 createdAt: "2025-09-13T09:30:00.000Z"
 *                 updatedAt: "2025-09-13T09:45:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: "Project name is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized - Missing or invalid token"
 *       403:
 *         description: Forbidden (Admin only)
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden - Admin access required"
 */

/**
 * @openapi
 * /projects/team/{teamId}:
 *   get:
 *     summary: Get all projects for a team
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the team
 *     responses:
 *       200:
 *         description: List of projects for the team
 *         content:
 *           application/json:
 *             example:
 *               teamId: "64c7f0a0b0d2b8c5c8d1e7f2"
 *               projects:
 *                 - _id: "64c7f123b0d2b8c5c8d1e7f3"
 *                   name: "Website Redesign"
 *                   description: "UI/UX overhaul and backend optimization"
 *                   createdAt: "2025-09-13T09:30:00.000Z"
 *                   updatedAt: "2025-09-13T09:45:00.000Z"
 *                 - _id: "64c7f999b0d2b8c5c8d1e7f5"
 *                   name: "Mobile App"
 *                   description: "New React Native application"
 *                   createdAt: "2025-09-13T11:10:00.000Z"
 *                   updatedAt: "2025-09-13T11:20:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized - Missing or invalid token"
 *       403:
 *         description: Forbidden (Admin only)
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden - Admin access required"
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Team not found"
 */
