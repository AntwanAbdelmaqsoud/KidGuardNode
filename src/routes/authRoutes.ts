import express, { Request, Response } from "express";
import passport from "../config/passport";
import { registerUser, loginUser } from "../controllers/authController";
import { IUser } from "../models/User";

const router = express.Router(); // api/auth/

// Local signup/login
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *       400:
 *        description: Email already in use
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */
router.post("/register", registerUser);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password (local strategy)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                message:
 *                  type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: IUser | false | null,
      info: { message?: string } | undefined
    ) => {
      loginUser(req, res, err, user, info);
    }
  )(req, res, next);
});

// Google OAuth signup/login
/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth2 login. Users will be redirected to /login on failure and to / on success.
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to Google for authentication
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: process.env.BASE_URL || "http://localhost:5173",
  })
);

// Logout user
/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user and destroy session. Redirects to / after successful logout.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Redirect to frontend after logout
 */
router.post("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.redirect(process.env.BASE_URL || "http://localhost:5173");
  });
});

export default router;
