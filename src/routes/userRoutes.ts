import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  updateUserInformation,
  deleteUserAccount,
} from "../controllers/userController";

const router = Router(); //api/user/

// Get current user info - Authenticated through passport session
/**
 * @openapi
 * /api/user/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   photoUrl:
 *                     type: string
 *                   isParent:
 *                     type: boolean
 *       401:
 *         description: Not authenticated
 */
router.get("/me", isAuthenticated, (req, res) => {
  const user: any = req.user;
  res.json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name ?? "",
      photoUrl: user.photoUrl ?? "",
      isParent: user.isParent ?? false,
    },
  });
});

// Update user information: name and/or photoUrl and/or isParent
/**
 * @openapi
 * /api/user/me:
 *   put:
 *     summary: Update authenticated user's information
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               photoUrl:
 *                 type: string
 *               isParent:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: No fields to update
 *       401:
 *         description: Not authenticated
 */
router.put("/me", isAuthenticated, updateUserInformation);

// Delete the currently authenticated user's account
/**
 * @openapi
 * /api/user/me:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User account deleted
 *       401:
 *         description: Not authenticated
 */
router.delete("/me", isAuthenticated, deleteUserAccount);

export default router;
