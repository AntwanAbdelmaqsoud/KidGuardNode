import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  addZone,
  listZones,
  removeZone,
} from "../controllers/allowedZoneController";

const router = Router(); //api/allowedZone/

/**
 * @openapi
 * /api/allowed-zone/:
 *   post:
 *     summary: Add an allowed zone for the authenticated user
 *     tags:
 *       - Allowed Zone
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zoneName:
 *                 type: string
 *               centerLat:
 *                 type: number
 *               centerLng:
 *                 type: number
 *               radiusMeters:
 *                 type: number
 *               childId:
 *                 type: string
 *             required:
 *               - zoneName
 *               - centerLat
 *               - centerLng
 *               - radiusMeters
 *               - childId
 *     responses:
 *       403:
 *         description: unAuthorized - user must be a parent
 *       400:
 *         description: Bad Request - missing zone parameters
 *       500:
 *         description: Internal Server Error - failed to add zone
 *       201:
 *         description: Zone created successfully
 */
router.post("/", isAuthenticated, addZone);
/**
 * @openapi
 * /api/allowed-zone/{childId}:
 *   get:
 *     summary: get allowed zones for a child of the authenticated user
 *     tags:
 *       - Allowed Zone
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: childId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the child to get allowed zones for
 *     responses:
 *       403:
 *         description: unAuthorized - user must be a parent
 *       400:
 *         description: Bad Request - child ID is required
 *       500:
 *         description: Internal Server Error - failed to add zone
 *       200:
 *         description: Zone list retrieved successfully
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
 *                   zoneName:
 *                     type: string
 *                   centerLat:
 *                     type: number
 *                   centerLng:
 *                     type: number
 *                   radiusMeters:
 *                     type: number
 */
router.get("/:childId", isAuthenticated, listZones);
/**
 * @openapi
 * /api/allowed-zone/{zoneId}:
 *   delete:
 *     summary: Delete the zone with the given ID
 *     tags:
 *       - Allowed Zone
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: zoneId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the zone to delete
 *     responses:
 *       204:
 *         description: Zone deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: unAuthorized - user must be a parent
 *       400:
 *         description: Bad Request - zone ID is required
 *       500:
 *         description: Internal Server Error - failed to delete zone
 */
router.delete("/:zoneId", isAuthenticated, removeZone);

export default router;
