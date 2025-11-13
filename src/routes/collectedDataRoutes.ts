import { Router } from "express";
import multer from "multer";
import {
  uploadCollectedData,
  getAudioById,
  listCollectedData,
} from "../controllers/collectedDataController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router(); //api/collected-data/

// Use multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
/**
 * @openapi
 * /api/collected-data/:
 *   post:
 *     summary: Upload collected data for the authenticated user
 *     tags:
 *       - Collected Data
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *               heartRate:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               stepCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Collected data uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user must be a child
 *       500:
 *         description: Server error
 */
router.post("/", isAuthenticated, upload.single("audio"), uploadCollectedData);
/**
 * @openapi
 * /api/collected-data/{childId}:
 *   get:
 *     summary: get collected data for a child of the authenticated user
 *     tags:
 *       - Collected Data
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the child to get collected data for
 *     responses:
 *       400:
 *         description: Bad Request - child ID is required
 *       500:
 *         description: Internal Server Error - failed to retrieve collected data
 *       200:
 *         description: Collected data list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   childId:
 *                     type: string
 *                   heartRate:
 *                     type: number
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *                   stepCount:
 *                     type: number
 */
router.get("/:childId", isAuthenticated, listCollectedData);
/**
 * @openapi
 * /api/collected-data/{Id}/audio:
 *   get:
 *     summary: get audio file by collected data ID
 *     tags:
 *       - Collected Data
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the collected data to get audio for
 *     responses:
 *       400:
 *         description: Bad Request - collected data ID is required
 *       500:
 *         description: Internal Server Error - failed to retrieve audio
 *       200:
 *         description: Audio file retrieved successfully
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/:id/audio", isAuthenticated, getAudioById);

export default router;
