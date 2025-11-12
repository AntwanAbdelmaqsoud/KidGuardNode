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
router.post("/", isAuthenticated, upload.single("audio"), uploadCollectedData);
router.get("/", isAuthenticated, listCollectedData);
router.get("/:id/audio", isAuthenticated, getAudioById);

export default router;
