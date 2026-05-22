import express from "express";
import {
    getTripsController,
    postTrip,
    patchTrip,
    deleteTripController,
    exportTripController
 } from "../controllers/searches.controller.js";

const router = express.Router();

router.get("/searches", getTripsController);
router.post("/searches", postTrip);
router.patch("/searches/:id", patchTrip);
router.delete("/searches/:id", deleteTripController);
router.post("/searches/export", exportTripController);

export default router;