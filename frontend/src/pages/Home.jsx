import { useState, useEffect } from "react";
import WeatherSearch from "../components/WeatherSearch";
import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import ForecastList from "../components/ForecastList";

import { fetchWeather } from "../services/weatherAPI";

export default function Home() {
    const [weatherData, setWeatherData] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (location) => {
        try {
            setLoading(true);
            setError(""); //why
            const data = await fetchWeather(location);
            setWeatherData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch("Times Square");
    }, []);


  return (
    <div className="home-container">

        <WeatherSearch onSearch={handleSearch} />

        {loading && (
            <p>Loading weather...</p>
        )}

        {error && (
            <p>{error}</p>
        )}

        <WeatherCard weatherData={weatherData} />

        <ForecastList forecast={weatherData?.forecast} />

      <div className="map-container">
        <WeatherMap coordinates={{
            lat: weatherData?.location?.lat,
            lon: weatherData?.location?.lon
        }} locationName={weatherData?.location?.name} />
      </div>

    </div>
  );
}