import axios from "axios";
import dotenv from "dotenv";

import { getCoordinates } from "./geocoding.service.js";

dotenv.config();

export const searchWeather = async (location) => {
  try {
    const coordinates = await getCoordinates(location);
    const currentWeatherResponse = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lon,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY
        }
      }
    );

    const forecastResponse = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat: coordinates.lat,
          lon: coordinates.lon,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY
        }
      }
    );

    return {
      location: {
        name: coordinates.name,
        country: coordinates.country,
        lat: coordinates.lat,
        lon: coordinates.lon
      },

      current: currentWeatherResponse.data,

      forecast: forecastResponse.data.list
    };

  } catch (error) {
    throw new Error(error.message);
  }
};