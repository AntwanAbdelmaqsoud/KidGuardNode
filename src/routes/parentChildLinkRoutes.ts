import { Router } from "express";
import {
  generateLink,
  verifyLink,
  getChildrenOfParent,
  deleteLink,
} from "../controllers/parentChildLinkController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router(); //api/parent-child/

router.get("/code/generate", isAuthenticated, generateLink);

router.post("/code/verify", isAuthenticated, verifyLink);

router.delete("/link/:id", isAuthenticated, deleteLink);

router.get("/children", isAuthenticated, getChildrenOfParent);

export default router;
