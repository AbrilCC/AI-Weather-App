export default function Home() {
  return (
    <div className="home-container">

      <div className="search-section">
        <input
          type="text"
          placeholder="Search location..."
          className="search-input"
        />
      </div>

      <div className="map-container">
        MAP GOES HERE
      </div>

    </div>
  );
}