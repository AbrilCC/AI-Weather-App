import express from "express";
import { getWeather } from "../controllers/weather.controller.js";

const router = express.Router();

router.post("/weather/search", getWeather);

export default router;