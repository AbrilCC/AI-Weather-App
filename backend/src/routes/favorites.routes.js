import express from "express";
import { addFavorite, getFavorites, deleteFavorite } from "../controllers/favorites.controller.js";

const router = express.Router();

router.get("/favorites", getFavorites);
router.post("/favorites", addFavorite);
router.delete("/favorites/:id", deleteFavorite);

export default router;