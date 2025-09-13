/**
 * @openapi
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard overview (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Dashboard overview fetched successfully"
 *               data:
 *                 totalUsers: 152
 *                 totalAssets: 430
 *                 totalTeams: 12
 *                 totalProjects: 25
 *                 recentUploads:
 *                   - _id: "64f12c9f5b8a9c001234abcd"
 *                     filename: "design.png"
 *                     uploadedBy: "Alok Raj"
 *                     createdAt: "2025-09-12T10:15:00.000Z"
 *                   - _id: "64f12c9f5b8a9c001234abce"
 *                     filename: "demo.mp4"
 *                     uploadedBy: "Jane Doe"
 *                     createdAt: "2025-09-12T11:20:00.000Z"
 *       401:
 *         description: Unauthorized (missing or invalid JWT)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized - Missing or invalid token"
 *       403:
 *         description: Forbidden (only admins can access this route)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Forbidden - Admin access required"
 */
