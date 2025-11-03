import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  addZone,
  listZones,
  removeZone,
} from "../controllers/allowedZoneController";

const router = Router(); //api/allowedZone/

router.post("/add", isAuthenticated, addZone);
router.get("/list", isAuthenticated, listZones);
router.delete("/:zoneId", isAuthenticated, removeZone);

export default router;
