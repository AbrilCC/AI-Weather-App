export default function ForecastList({ forecast }) {
  if (!forecast) return null;

  const dailyForecast = forecast.filter((item, index) => index % 8 === 0);

  return (
    <div className="forecast-container">

        {dailyForecast.map((day, index) => (
            <div key={index} className="forecast-card">
                <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>

                <h3>{Math.round(day.main.temp)}°C</h3>

                <p>{day.weather[0].description}</p>
            </div>
        ))}

    </div>
  );
}