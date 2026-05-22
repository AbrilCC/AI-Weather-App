import { formatDate } from "../utils/formatDate";

export default function ForecastList({ forecast, historicalData, activeDay, setActiveDay, unitSystem }) {

  if (historicalData) {
    const formatTemperature = (celsius) => {
        if (unitSystem === "imperial") return ((celsius * 9/5) + 32).toFixed(1) + "°F";
        return celsius.toFixed(1) + "°C";
    };

    return (
      <div className="forecast-container">
        {historicalData.history.time.map((date, index) => {
          const isActive = (activeDay === date) || (activeDay === null && index === 0);
          const temp = historicalData.history.temperature_2m_mean[index];
          const { date: dateLabel, day: dayLabel } = formatDate(date);

          return (
              <div key={date} className={`forecast-card ${isActive ? "active" : ""}`}
                  onClick={() => setActiveDay(date)}>
                  <h4>{dateLabel}</h4>
                  <p>{dayLabel}</p>
                  <h3>{formatTemperature(temp)}</h3>
              </div>
          );
        })}
      </div>
    );
  }

  if (!forecast?.length) return null;
  
  const getWeatherEmoji = (main) => {
    const weather = main.toLowerCase();
    if (weather.includes("cloud")) return { emoji: "☁️", cls: "cloudy" };
    if (weather.includes("rain") || weather.includes("drizzle")) return { emoji: "🌧️", cls: "rainy" };
    if (weather.includes("thunder") || weather.includes("storm")) return { emoji: "⛈️", cls: "storm" };
    if (weather.includes("snow")) return { emoji: "❄️", cls: "snowy" };
    if (weather.includes("mist") || weather.includes("fog")) return { emoji: "🌫️", cls: "fog" };
    if (weather.includes("clear") || weather.includes("sunny")) return { emoji: "☀️", cls: "sunny" };
    return { emoji: "", cls: "sunny" };
  };
  
  return (
    <div className="forecast-container">

        {forecast.map((day, index) => {
          const isReturn = index === forecast.length-1;
          const { emoji, cls } = getWeatherEmoji(day.weather.main);
          const { day: dayLabel } = formatDate(day.date);


            return (
                <div key={day.date} className={`forecast-card ${cls} ${isReturn ? "return" : ""}`}>
                  {/*<h3>{new Date(day.date).toLocaleDateString("en-US",{weekday:"long"})}</h3>*/}
                  <h3>{dayLabel}</h3>
                  <h3>{emoji}{" "}{Math.round(day.avgTemp)}{unitSystem === "imperial" ? "°F" : "°C"}</h3>
                  <p>{day.weather.description}</p> 
                </div>
            )
        })}
    </div>
  );
}