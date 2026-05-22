import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getCoordinates = async (location) => {
  try {
    //Detects if the input comes in coordinates
    const coordsMatch = location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);

    let place;
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]);
      const lon = parseFloat(coordsMatch[2]);
      
      const response = await axios.get("https://api.openweathermap.org/geo/1.0/reverse", {
        params: { lat, lon, limit: 1, appid: process.env.OPENWEATHER_API_KEY }
      });
      if (!response.data.length) throw new Error("Location not found");
        /*place = response.data[0];*/
      const name = response.data[0]?.name || `${lat}, ${lon}`;

      return {
          name,
          country: response.data[0]?.country || "",
          lat,
          lon
      };

    } else {
      const response = await axios.get("https://api.openweathermap.org/geo/1.0/direct",
        {
          params: {
            q: location,
            limit: 1,
            appid: process.env.OPENWEATHER_API_KEY
          }
        }
      );
      if (!response.data.length) throw new Error("Location not found");
      place = response.data[0];
    }
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


export const getLocationSuggestions = async (query) => {
  const response = await axios.get(
    "https://api.openweathermap.org/geo/1.0/direct",
    {
      params: {
        q: query,
        limit: 5,
        appid: process.env.OPENWEATHER_API_KEY
      }
    }
  );
  return response.data;
};