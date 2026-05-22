# Weather App – Fullstack Travel Planner

Web application for weather consulting and vacation planning.

Features:
- Current weather
- Multi-day forecast
- Historical temperature averages
- Favorite locations
- Search history export (JSON/XML/CSV/PDF/Markdown)
- Interactive maps
- Destination travel videos

## Requirements
* Node.js >= 20
* npm >= 10
* PostgreSQL >= 13
* Git
* Bash (Linux/macOS or WSL on Windows)

## Tech Stack
### Backend
- Node.js v20.20.0
- Express v5.2.1
- PostgreSQL
- Axios
- Open Weather Map API
- Open Meteo API
- YouTube Data API v3

### Frontent
- React v19.2.6
- Vite v8.0.12
- Axios
- Leaflet Maps
- React Router
- Lucide React



## Setup and Execution

1. Create an .env file in backend and frontend following the .env_example files.
* Create a PostgreSQL database (local PostgreSQL or Supabase PostgreSQL).
* Create an account (or use an existing one) at https://openweathermap.org/ and click Get API Key.
* Login your Google account and go to https://console.cloud.google.com/ → create a new project → in the APIs and Services section (at the sidebar) go to YouTube Data API v3 → Enable → configure your API key.
* Use the same PORT in both backend/.env and frontend/.env.

2. Setup your project:
```
cd scripts/ 
chmod +x setup.sh
./setup.sh
```

3. Run the application
```
chmod +x run.sh
./run.sh
```

4. Find the project in http://localhost:5173 or change the backend/src/app.js file to use a different port.