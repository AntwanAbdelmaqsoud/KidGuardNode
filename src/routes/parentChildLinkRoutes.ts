import { Router } from "express";
import {
  generateLink,
  verifyLink,
} from "../controllers/parentChildLinkController";

const router = Router(); //api/parentChild/

router.post("/link", generateLink);

router.post("/verify", verifyLink);

export default router;
