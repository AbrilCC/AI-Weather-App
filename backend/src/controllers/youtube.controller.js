import { searchYouTubeVideos } from "../services/youtube.service.js";

export const getVideos = async (req, res) => {
    try {
        const { location_name, country, latitude, departure_date } = req.body;
        if (!location_name) {
            return res.status(400).json({ error: "location_name required" });
        }
        const result = await searchYouTubeVideos(location_name, country, latitude, departure_date);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};