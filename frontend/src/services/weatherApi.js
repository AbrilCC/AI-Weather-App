  import axios from "axios";

  const API_BASE_URL = "http://localhost:5000/api";

  export const fetchWeather = async (searchData, unitSystem) => {
      try {
      const response = await axios.post(
        `${API_BASE_URL}/weather/search`,
        {
          ...searchData,
          unitSystem
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch weather",
        {cause: error}
      );
    }
  };


  export const createTrip = async (tripData) => {
      const response = await axios.post(
          "http://localhost:5000/api/searches",
          tripData
      );
      return response.data;
  };

  export const getTrips = async () => {
      const response = await axios.get(
          "http://localhost:5000/api/searches"
      );
      return response.data;
  };

  export const editTrip = async (id, data) => {
      const response = await axios.patch(
          `http://localhost:5000/api/searches/${id}`,
          data
      );
      return response.data;
  };

  export const deleteTrip = async (id) => {
      const response = await axios.delete(
          `http://localhost:5000/api/searches/${id}`
      );

      return response.data;
  };

  export const exportTrip = async (format, id) => {
      const response = await axios.post(`${API_BASE_URL}/searches/export`,
          { format, id },
          { responseType: "blob" }
      );
      return response;
  };


  export const addFavorite = async (locationData) => {
    const response = await axios.post(
      `${API_BASE_URL}/favorites`,
      locationData
    );
    return response.data;
  };

  export const getFavorites = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/favorites`
    );
    return response.data;
  };

  export const deleteFavorite = async (id) => {
    await axios.delete(
      `${API_BASE_URL}/favorites/${id}`
    );
  };

  export const fetchYouTubeVideos = async (locationData) => {
      const response = await axios.post(`${API_BASE_URL}/youtube/search`, locationData);
      return response.data;
  };