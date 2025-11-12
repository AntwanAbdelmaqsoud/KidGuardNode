import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  addZone,
  listZones,
  removeZone,
} from "../controllers/allowedZoneController";

const router = Router(); //api/allowedZone/

router.post("/", isAuthenticated, addZone);
router.get("/", isAuthenticated, listZones);
router.delete("/:zoneId", isAuthenticated, removeZone);

export default router;
