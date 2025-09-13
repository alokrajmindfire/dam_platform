/**
 * @openapi
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "750f1c9f5b8a9c002345bcde"
 *         name:
 *           type: string
 *           example: "Engineering"
 *         description:
 *           type: string
 *           example: "Team responsible for backend services"
 *         members:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f12c9f5b8a9c001234abcd"
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *                 example: "member"
 *         createdBy:
 *           type: string
 *           example: "64f12c9f5b8a9c001234abcd"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-12T10:20:30.456Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-12T10:25:30.456Z"
 */

/**
 * @openapi
 * /teams:
 *   get:
 *     summary: Get all teams the logged-in user has access to
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: "750f1c9f5b8a9c002345bcde"
 *                   name: "Engineering"
 *                   description: "Team responsible for backend services"
 *                   members:
 *                     - userId: "64f12c9f5b8a9c001234abcd"
 *                       role: "owner"
 *                     - userId: "64f12c9f5b8a9c001234abce"
 *                       role: "member"
 *                   createdBy: "64f12c9f5b8a9c001234abcd"
 *                   createdAt: "2025-09-12T10:20:30.456Z"
 *                   updatedAt: "2025-09-12T10:25:30.456Z"
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Engineering"
 *               description:
 *                 type: string
 *                 example: "Team responsible for backend services"
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "750f1c9f5b8a9c002345bcde"
 *               name: "Engineering"
 *               description: "Team responsible for backend services"
 *               members: []
 *               createdBy: "64f12c9f5b8a9c001234abcd"
 *               createdAt: "2025-09-12T10:20:30.456Z"
 *               updatedAt: "2025-09-12T10:20:30.456Z"
 *       403:
 *         description: Forbidden - Only admins can create teams
 */

/**
 * @openapi
 * /teams/{teamId}/members:
 *   post:
 *     summary: Add a member to a team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f12c9f5b8a9c001234abcd"
 *               role:
 *                 type: string
 *                 enum: [owner, admin, member]
 *                 example: "member"
 *     responses:
 *       200:
 *         description: Member added successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "750f1c9f5b8a9c002345bcde"
 *               name: "Engineering"
 *               description: "Team responsible for backend services"
 *               members:
 *                 - userId: "64f12c9f5b8a9c001234abcd"
 *                   role: "owner"
 *                 - userId: "64f12c9f5b8a9c001234abcf"
 *                   role: "member"
 *               createdBy: "64f12c9f5b8a9c001234abcd"
 *               createdAt: "2025-09-12T10:20:30.456Z"
 *               updatedAt: "2025-09-12T10:30:30.456Z"
 *       403:
 *         description: Forbidden - Only admins can add members
 *       404:
 *         description: Team or user not found
 *
 *   get:
 *     summary: Get all members of a team (Admin only)
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: List of team members
 *         content:
 *           application/json:
 *             example:
 *               - userId: "64f12c9f5b8a9c001234abcd"
 *                 role: "owner"
 *               - userId: "64f12c9f5b8a9c001234abcf"
 *                 role: "member"
 *       403:
 *         description: Forbidden - Only admins can view members
 *       404:
 *         description: Team not found
 */
