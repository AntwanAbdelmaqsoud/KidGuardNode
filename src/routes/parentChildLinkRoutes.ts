import { Router } from "express";
import {
  generateLink,
  verifyLink,
  getChildrenOfParent,
  deleteLink,
} from "../controllers/parentChildLinkController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router(); //api/parentChild/

router.get("/link", isAuthenticated, generateLink);

router.delete("/link/:id", isAuthenticated, deleteLink);

router.post("/verify", isAuthenticated, verifyLink);

router.get("/children", isAuthenticated, getChildrenOfParent);

export default router;
