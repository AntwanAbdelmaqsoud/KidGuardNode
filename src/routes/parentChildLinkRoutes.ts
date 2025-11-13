import { Router } from "express";
import {
  generateLink,
  verifyLink,
  getChildrenOfParent,
  deleteLink,
} from "../controllers/parentChildLinkController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router(); //api/parent-child/

/**
 * @openapi
 * /api/parent-child/code/generate:
 *   get:
 *     summary: Get code to link a child account to the authenticated parent
 *     tags:
 *       - Parent Child Link
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Code to link child account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: number
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden - user must be a parent
 *       500:
 *         description: Internal Server Error - failed to generate link
 */
router.get("/code/generate", isAuthenticated, generateLink);

/**
 * @openapi
 * /api/parent-child/code/verify:
 *   post:
 *     summary: Verify code to link child account to authenticated parent
 *     tags:
 *       - Parent Child Link
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: number
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: Child linked to parent successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Link not found or code invalid
 *       500:
 *         description: Server error
 */
router.post("/code/verify", isAuthenticated, verifyLink);

/**
 * @openapi
 * /api/parent-child/link/{id}:
 *   delete:
 *     summary: Delete the parent-child link with the given ID
 *     tags:
 *       - Parent Child Link
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ChildID of the link to delete
 *     responses:
 *       204:
 *         description: Link deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: unAuthorized - user must be a parent
 *       400:
 *         description: Bad Request - ChildID is required
 *       500:
 *         description: Internal Server Error - failed to delete link
 */

router.delete("/link/:id", isAuthenticated, deleteLink);

/**
 * @openapi
 * /api/parent-child/children:
 *   get:
 *     summary: Get children IDs linked to the authenticated parent
 *     tags:
 *       - Parent Child Link
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Children IDs linked to the authenticated parent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 children:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Forbidden - user must be a parent
 *       500:
 *         description: Internal Server Error - failed to retrieve children
 */
router.get("/children", isAuthenticated, getChildrenOfParent);

export default router;
