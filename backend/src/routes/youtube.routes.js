import express from "express";
import { getVideos } from "../controllers/youtube.controller.js";

const router = express.Router();

router.post("/youtube/search", getVideos);

export default router;