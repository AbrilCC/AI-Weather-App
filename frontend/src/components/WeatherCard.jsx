//Weather information card
export default function WeatherCard({ weatherData }) {
  if (!weatherData) return null;
  const current = weatherData.current;

  return (
    <div className="weather-card">

      <h2>{weatherData.location.name}, {" "} {weatherData.location.country}</h2>

      <h1>{Math.round(current.main.temp)}°C</h1>

      <p>{current.weather[0].description}</p>

      <div className="weather-details">
        <p>Humidity: {current.main.humidity}%</p>

        <p>Wind: {current.wind.speed} m/s</p>

        <p>Feels like: {Math.round(current.main.feels_like)}°C</p>
      </div>

    </div>
  );
}