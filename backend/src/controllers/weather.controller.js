import { searchWeather } from "../services/weather.service.js";

export const getWeather = async (req, res) => {
    try {
        const { location, departure_date, return_date, unitSystem } = req.body;
        if (!location) {
            return res.status(400).json({error:"Location is required"});
        }
        const weatherData = await searchWeather({location, departure_date, return_date, unitSystem});
        res.status(200).json(weatherData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}