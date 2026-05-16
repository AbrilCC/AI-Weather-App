import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getCoordinates = async (location) => {
  try {
    const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct",
      {
        params: {
          q: location,
          limit: 1,
          appid: process.env.OPENWEATHER_API_KEY
        }
      }
    );
    if (!response.data.length) {
      throw new Error("Location not found");
    }
    const place = response.data[0];
    return {
      name: place.name,
      country: place.country,
      lat: place.lat,
      lon: place.lon
    };

  } catch (error) {
    throw new Error(error.message);
  }
};