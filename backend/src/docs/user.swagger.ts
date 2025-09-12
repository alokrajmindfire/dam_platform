/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f12c9f5b8a9c001234abcd"
 *         email:
 *           type: string
 *           format: email
 *           example: "alok@example.com"
 *         fullName:
 *           type: string
 *           example: "Alok Raj"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-10T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-10T12:34:56.789Z"
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Alok Raj"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alok@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass@123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alok@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass@123"
 *     responses:
 *       200:
 *         description: User logged in successfully (with JWT cookie)
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only JWT access token cookie
 *             schema:
 *               type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully (accessToken cookie cleared)
 */
