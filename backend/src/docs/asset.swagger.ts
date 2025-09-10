/**
 * @openapi
 * components:
 *   schemas:
 *     Asset:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f12c9f5b8a9c001234abcd"
 *         filename:
 *           type: string
 *           example: "2d0b9a7a-33f7-4b8b-97ef-9d2d7e65e8a2.png"
 *         originalName:
 *           type: string
 *           example: "my-photo.png"
 *         mimeType:
 *           type: string
 *           example: "image/png"
 *         size:
 *           type: number
 *           example: 204800
 *         storagePath:
 *           type: string
 *           example: "assets/2d0b9a7a-33f7.png"
 *         status:
 *           type: string
 *           enum: [uploading, processing, ready, failed]
 *           example: "uploading"
 *         url:
 *           type: string
 *           example: "https://minio.localhost/assets/2d0b9a7a-33f7.png"
 *         thumbnailUrlSigned:
 *           type: string
 *           example: "https://minio.localhost/assets/thumbs/2d0b9a7a.png"
 *         transcodedUrls:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example:
 *             720p: "https://minio.localhost/assets/video_720.mp4"
 *             1080p: "https://minio.localhost/assets/video_1080.mp4"
 */

/**
 * @openapi
 * /assets/upload:
 *   post:
 *     summary: Upload multiple assets
 *     description: Upload up to 10 assets (images, videos, PDFs). JWT required.
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Assets uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Assets uploaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asset'
 *       400:
 *         description: No files provided
 *       404:
 *         description: User does not exist
 */

/**
 * @openapi
 * /assets/{id}:
 *   get:
 *     summary: Get a signed URL for an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Assets found successfully
 *                 data:
 *                   type: string
 *                   example: "https://minio.localhost/assets/signed-url.png"
 *       404:
 *         description: User or asset not found
 */

/**
 * @openapi
 * /assets:
 *   get:
 *     summary: Get all assets for the logged-in user
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter by type/status/tag
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Assets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Assets retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     assets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Asset'
 *                     total:
 *                       type: integer
 *                       example: 42
 *       401:
 *         description: Unauthorized
 */
