import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import client from "./config/supabaseClient.js";
import weatherRoutes from "./routes/weather.routes.js"

const PORT = process.env.PORT;

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

app.get("/", (req, res) => {
  res.send("Weather API running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
