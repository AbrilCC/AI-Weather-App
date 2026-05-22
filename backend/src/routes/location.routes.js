import express from "express";
import { autocompleteLocations } from "../controllers/locations.controller.js";

const router = express.Router();

router.get("/locations/autocomplete", autocompleteLocations);

export default router;