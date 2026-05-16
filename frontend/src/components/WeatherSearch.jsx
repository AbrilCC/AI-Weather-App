//The location search bar
import { useState } from "react";

export default function WeatherSearch({ onSearch }) {
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;
    onSearch(location);
  };

  return (
    <form className="search-section" onSubmit={handleSubmit}>

      <input type="text" placeholder="Search destination..." className="search-input"
        value={location} onChange={(e) => setLocation(e.target.value)}/>

      <button type="submit" className="search-button">
        Search Weather
      </button>
    </form>
  );
}