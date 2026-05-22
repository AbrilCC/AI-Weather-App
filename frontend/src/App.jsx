import { useState } from 'react';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Sidebar from "./components/Sidebar";

import './styles/styles.css';
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  const [tripsVersion, setTripsVersion] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <>
    <div className="app-container">
      <TopBar />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        favoritesVersion={favoritesVersion}
        tripsVersion={tripsVersion}
        onTripSelect={setSelectedTrip}
        onFavoriteSelect={(favorite) => setSelectedTrip({ 
          location_name: favorite.location_name,
          departure_date: null,
          return_date: null
        })}
      />

      <Home
        setSidebarOpen={setSidebarOpen} 
        refreshFavorites={() => setFavoritesVersion(prev => prev + 1)}
        refreshTrips={() => setTripsVersion(v => v + 1)}
        selectedTrip={selectedTrip}
        clearSelectedTrip={() => setSelectedTrip(null)}
      />
    </div>
    </>
  )
}

export default App
