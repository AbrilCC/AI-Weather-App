import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchWeather = async (location) => {
    try {
    const response = await axios.post(
      `${API_BASE_URL}/weather/search`,
      {
        location
      }
    );
    return response.data;

  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch weather"
    );

  }

};