import { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import { getFavorites } from "../services/weatherApi";
import { formatDate } from "../utils/formatDate";


export default function WeatherCard({ weatherData, unitSystem, refreshFavorites, activeDay }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
        try {
            const favorites = await getFavorites();

            const existingFavorite = favorites.find((favorite) => 
                favorite.latitude === weatherData.location.lat &&
                favorite.longitude === weatherData.location.lon
            );

            if (existingFavorite) {
                setIsFavorite(true);
                setFavoriteId(existingFavorite.id);
            } else {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        } catch (error) {
        console.error(error);
        }
    };
    if (weatherData) {
        checkFavoriteStatus();
    }
  }, [weatherData]);
    
  if (!weatherData) return null;

  const saveFavorite = async () => {
    try {
        if (isFavorite) {
            await axios.delete(`http://localhost:5000/api/favorites/${favoriteId}`);
            setIsFavorite(false);
            setFavoriteId(null);
            refreshFavorites();
            return;
        }
        const response = await axios.post("http://localhost:5000/api/favorites",
            {
                location_name: weatherData.location.name,
                latitude: weatherData.location.lat,
                longitude: weatherData.location.lon
            }
        );
        setIsFavorite(true);
        setFavoriteId(response.data.id);
        refreshFavorites();
    } catch (error) {
        console.error(error);
    }
  };

  const getTempClass = (c) => {
    if (c < 0)  return "temp-freezing";
    if (c < 10) return "temp-cold";
    if (c < 20) return "temp-cool";
    if (c < 30) return "temp-warm";
    if (c < 40) return "temp-hot";
    return "temp-scorching";
  };

if (weatherData.type==="historical") {
  const formatTemperature = (celsius) => {
    if (unitSystem === "imperial") {
      return ((celsius * 9/5) + 32).toFixed(1) + "°F";
    }
    return celsius.toFixed(1) + "°C";
  };
  const activeDayIndex = activeDay !== null ? weatherData.history.time.indexOf(activeDay) : 0;
  const displayDate = weatherData.history.time[activeDayIndex];
  const displayTemp = weatherData.history.temperature_2m_mean[activeDayIndex];
  const { date: dateLabel } = formatDate(displayDate)

  return(
    <div className={`weather-card historical ${getTempClass(displayTemp)}`}>
      <button className={`favorite-button ${isFavorite ? "active" : ""}`} onClick={saveFavorite}>
        <Star size={30} fill={isFavorite ? "#facc15" : "none"}
          color={isFavorite ? "#facc15" : "white"} strokeWidth={2}/>
      </button>

      <h1>{weatherData.location.name}</h1>
      <p>{dateLabel}</p>
      <p style={{"color": "grey"}}>For this time of the year, the temperature is usually:</p>
      <h1>{formatTemperature(displayTemp)}</h1>
    </div>
  );
}

  const weatherMain = weatherData.current.weather[0].main.toLowerCase();

  let weatherClass = "sunny";
  if (weatherMain.includes("cloud")) {
    weatherClass = "cloudy";
  }
  else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
    weatherClass = "rainy";
  }
  else if (weatherMain.includes("thunder")) {
    weatherClass = "storm";
  }
  else if (weatherMain.includes("snow")) {
    weatherClass = "snowy";
  }
  else if (weatherMain.includes("fog") || weatherMain.includes("mist") || weatherMain.includes("haze")) {
    weatherClass = "fog";
  }

  const tempForClass = unitSystem === "imperial"
    ? Math.round((weatherData.current.main.temp - 32) * 5/9)
    : Math.round(weatherData.current.main.temp);
  
  const localTimestamp = weatherData.current.dt + weatherData.current.timezone;
  const currentHour = new Date(localTimestamp * 1000).getUTCHours();
  if (currentHour >= 19 || currentHour <= 5) {
    weatherClass = "night";
  }

  return (
    <div className={`weather-card ${weatherClass} ${getTempClass(tempForClass)}`}>
        <div className="weather-content">
            <h1>{weatherData.location.name}</h1>
            <h2>{Math.round(weatherData.current.main.temp)}
                {(unitSystem === "imperial" ? "°F" : "°C")}
            </h2>
            <p>{weatherData.current.weather[0].description}</p>
        </div>

        <div className="weather-details">
            <p>Humidity: {" "} {weatherData.current.main.humidity}%</p>
            <p>Wind: {" "} {weatherData.current.wind.speed} m/s</p>
            <p>Feels like: {" "} {Math.round(weatherData.current.main.feels_like)}{unitSystem === "imperial" ? "°F" : "°C"}</p>
        </div>

        <button className={`favorite-button ${isFavorite ? "active" : ""}`} onClick={saveFavorite}>
            <Star size={30} fill={isFavorite ? "#facc15" : "none"}
            color={isFavorite ? "#facc15" : "white"} strokeWidth={2}/>
        </button>

    </div>
  );
}