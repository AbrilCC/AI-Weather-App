//The location search bar
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, CalendarDays } from "lucide-react";

export default function WeatherSearch({ onSearch }) {
  const [location, setLocation] = useState("");
  const [departure_date, setDepartureDate] = useState(null);
  const [return_date, setReturnDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (value) => {
    if (value.length < 2) {
        setSuggestions([]);
        return;
    }
    try {
        const response = await axios.get("http://localhost:5000/api/locations/autocomplete",
            {
                params : {q: value}
            }
        );
        setSuggestions(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    if (departure_date && return_date && return_date < departure_date) {
        alert("Return date cannot be earlier than departure date");
        return;
    }
    if (departure_date && !return_date) {
        alert("Please select a return date");
        return;
    }

    onSearch({
        location,
        departure_date,
        return_date
    });
  };

  return (
    <form className="search-section" onSubmit={handleSubmit}>
    
    <div className="search-input-wrapper">
        <input type="text" placeholder="Where are you travelling to?" className="search-input" value={location} 
            onChange={(e) => {setLocation(e.target.value); fetchSuggestions(e.target.value)}}/>
        {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((place, index) => (
                  <div key={index} className="suggestion-item"
                    onClick={() => {
                        const selectedLocation = `${place.name}, ${place.country}`
                        setLocation(selectedLocation);
                        setSuggestions([]);
                        onSearch({location: selectedLocation, departure_date, return_date});
                        }}>
                    <MapPin size={18} />
                    <span>{place.name}{place.state ? `, ${place.state}` : ""}{` ${place.country}`}</span>
                  </div>
              ))}
            </div>
        )}
    </div>

        <div className="date-picker-container">
            <CalendarDays size={18} />
            <DatePicker
                selected={departure_date}
                onChange={(date) => setDepartureDate(date)}
                placeholderText="Select departure (optional)"
                className="custom-date-picker"/>
        </div>

        <div className="date-picker-container">
            <CalendarDays size={18} />
            <DatePicker
                selected={return_date}
                onChange={(date) => setReturnDate(date)}
                placeholderText="Select return (optional)"
                className="custom-date-picker"/>
        </div>


      <button type="submit" className="search-button">
        Search Weather
      </button>

    </form>
  )
}