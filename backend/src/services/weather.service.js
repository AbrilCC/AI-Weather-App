import axios from "axios";
import dotenv from "dotenv";

import { getCoordinates } from "./geocoding.service.js";

dotenv.config();

export const searchWeather = async ({location, departure_date, return_date, unitSystem}) => {
  try {
     if (departure_date && return_date) {
        const dep = new Date(departure_date);
        const ret = new Date(return_date);
        
        if (isNaN(dep.getTime()) || isNaN(ret.getTime())) {
            throw new Error("Invalid date format");
        }
        if (ret < dep) {
            throw new Error("Return date cannot be earlier than departure date");
        }
    }
    if (departure_date && !return_date) {
        throw new Error("Return date is required when departure date is provided");
    }
    
    const coordinates = await getCoordinates(location);
    if (departure_date && return_date) {
      return await getClimateAverage(coordinates, departure_date, return_date);
    }
    return await getCurrentWeather(coordinates, unitSystem);

  } catch (error) {
    throw new Error(error.message);
  }
};

//Historical: Calculates the average from the last 5 years
const getClimateAverage = async (coordinates, departure_date, return_date) => {

  const average = (values) => {
    return (values.reduce((a,b)=>a+b, 0) / values.length);
  };
  const dep = new Date(departure_date);
  const ret = new Date(return_date);
  const currentYear = new Date().getFullYear();
  const years=[];
  for (let y = currentYear-5; y < currentYear; y++) {
    years.push(y);
  }
  const responses = await Promise.all(years.map((year) => {
    const start = new Date(dep);
    const end = new Date(ret);
    start.setFullYear(year);
    end.setFullYear(year);

    return axios.get("https://archive-api.open-meteo.com/v1/archive",
      {
        params:{
          latitude: coordinates.lat,
          longitude: coordinates.lon,
          start_date: start.toISOString().split("T")[0],
          end_date: end.toISOString().split("T")[0],
          daily:"temperature_2m_mean"
        }
      }
    );
  }));

  const rangeLength = responses[0].data.daily.time.length;
  const averages = Array.from({ length: rangeLength }, (_, index) => {
    const values = responses.map((r) => r.data.daily.temperature_2m_mean[index]);
    return average(values);
  });
  const actualDates = [];
  const cursor = new Date(dep);
  while (cursor <= ret) {
      actualDates.push(cursor.toISOString().split("T")[0]);
      cursor.setDate(cursor.getDate() + 1);
  }

  return {
    type:"historical",
    source:"5_year_average",
    location:{
        name: coordinates.name,
        lat: coordinates.lat,
        lon: coordinates.lon
    },
    history:{
      time: actualDates,
      temperature_2m_mean: averages
    }
  };
};

const getCurrentWeather = async (coordinates, unitSystem)=>{

  const current = await axios.get("https://api.openweathermap.org/data/2.5/weather",
  {
    params:{
      lat:coordinates.lat,
      lon:coordinates.lon,
      units:unitSystem || "metric",
      appid:
      process.env.OPENWEATHER_API_KEY
    }
  });
  const forecast = await axios.get("https://api.openweathermap.org/data/2.5/forecast",
  {
    params:{
      lat:coordinates.lat,
      lon:coordinates.lon,
      units:unitSystem || "metric",
      appid:
      process.env.OPENWEATHER_API_KEY
    }
  });

  const grouped = {};
  const todayStr = new Date().toISOString().split("T")[0];
  forecast.data.list.forEach((item) => {
    const day = item.dt_txt.split(" ")[0];
    if (day === todayStr) return;
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(item);
  });

  const forecastDays = Object.entries(grouped).map(([date, items]) => ({
    date,
    avgTemp: items.reduce((sum, i) => sum + i.main.temp, 0) / items.length,
    weather: items[Math.floor(items.length / 2)].weather[0]
  }));

  return {
    type:"current",
    location:{
      name:coordinates.name,
      country:coordinates.country,
      lat:coordinates.lat,
      lon:coordinates.lon
    },
    current:current.data,
    forecast: forecastDays
  };
};