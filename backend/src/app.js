import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import client from "./config/supabaseClient.js";
import weatherRoutes from "./routes/weather.routes.js"
import locationsRoutes from "./routes/location.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import searchesRoutes from "./routes/searches.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

async function testDB() {
  try {
    const res = await client.query("SELECT NOW()");
    console.log(res.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
}
testDB();

app.use("/api", weatherRoutes);
app.use("/api", locationsRoutes);
app.use("/api", favoritesRoutes);
app.use("/api", searchesRoutes);
app.use("/api", youtubeRoutes);

app.get("/", (req, res) => {
  res.send("Weather API running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
