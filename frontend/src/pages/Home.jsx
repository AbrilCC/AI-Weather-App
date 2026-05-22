import { useState, useEffect, useRef } from "react";
import WeatherSearch from "../components/WeatherSearch";
import WeatherCard from "../components/WeatherCard";
import WeatherMap from "../components/WeatherMap";
import ForecastList from "../components/ForecastList";
import YouTubeSection from "../components/YouTubeSection";
import {
    fetchWeather,
    createTrip,
    getTrips,
    editTrip,
    deleteTrip
} from "../services/weatherApi";
import { fetchYouTubeVideos } from "../services/weatherApi";
import { Menu, LocateFixed } from "lucide-react";

export default function Home({ setSidebarOpen, refreshFavorites, refreshTrips, selectedTrip, clearSelectedTrip }) {
    const [weatherData, setWeatherData] = useState(null);
    const [unitSystem, setUnitSystem] = useState("metric");
    const [lastSearch, setLastSearch] = useState({location: "New York City"});
    const [activeDay, setActiveDay] = useState(null);
    const [videos, setVideos] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (searchData, fetchYouTube = true) => {
        try {
            setLoading(true);
            setError("");
            setLastSearch(searchData);
            const data = await fetchWeather(searchData, unitSystem);
            setWeatherData(data);
            setActiveDay(null);

            if (fetchYouTube) {
                try {
                    const youtubeResult = await fetchYouTubeVideos({
                        location_name: data.location.name,
                        country: data.location.country,
                        latitude: data.location.lat,
                        departure_date: searchData.departure_date || null
                    });
                    setVideos(youtubeResult.videos);
                } catch {
                    setVideos([]);
                }
            }
            const avgTemp = data.type === "historical"
                ? data.history.temperature_2m_mean.reduce((a, b) => a + b, 0) / data.history.temperature_2m_mean.length
                : null;

            await createTrip({
                location_name: data.location.name,
                latitude: data.location.lat,
                longitude: data.location.lon,
                departure_date: searchData.departure_date || null,
                return_date: searchData.return_date || null,
                temperature: data.current?.main?.temp ?? avgTemp ?? null,
                weather_description: data.current?.weather[0]?.description ?? data.departure?.weather?.description ?? null
            });
            refreshTrips();

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            handleSearch(lastSearch, false);
            return;
        }
        handleSearch(lastSearch);
    }, [unitSystem]);

    useEffect(() => {
        if (!selectedTrip) return;
        handleSearch({
            location: selectedTrip.location_name,
            departure_date: selectedTrip.departure_date ? new Date(selectedTrip.departure_date) : null,
            return_date: selectedTrip.return_date ? new Date(selectedTrip.return_date) : null,
        });
        clearSelectedTrip();
    }, [selectedTrip]);

    const useCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await handleSearch({location: `${lat},${lon}`});
            },
            (error) => {
                console.error(error);
            }
        );
    };


  return (
    <div className="home-container">
        <div className="top-home-bar">
            <button className="menu-button" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
            </button>

            <div className={`unit-toggle ${
                unitSystem === "imperial"
                    ? "imperial"
                    : ""
                }`} onClick={() => setUnitSystem(
                    unitSystem === "metric"
                        ? "imperial"
                        : "metric")}>
                <div className="toggle-slider"></div>
                    <span>°C</span>
                    <span>°F</span>
            </div>
        </div>

        <WeatherSearch onSearch={handleSearch} />

        {loading && (
            <p>Loading weather...</p>
        )}

        {error && (
            <p>{error}</p>
        )}

        <WeatherCard
            weatherData={weatherData}
            unitSystem={unitSystem}
            refreshFavorites={refreshFavorites}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
        />

        <ForecastList
            forecast={weatherData?.forecast}
            historicalData={weatherData?.type === "historical" ? weatherData : null}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            unitSystem={unitSystem}
        />

        <div className="map-header">
            <div className="location-title">
                <h2>{weatherData?.location?.name}</h2>
                <p>Live interactive weather map</p>
            </div>

            <button className="location-button" onClick={useCurrentLocation}>
                <LocateFixed size={20}/>
            </button>

        </div>

        <div className="map-container">
            <WeatherMap
                coordinates={{
                    lat: weatherData?.location?.lat,
                    lon: weatherData?.location?.lon
                }}
            />
        </div>

        <YouTubeSection
            videos={videos}
            locationName={weatherData?.location?.name}
        />

    </div>
  );
}