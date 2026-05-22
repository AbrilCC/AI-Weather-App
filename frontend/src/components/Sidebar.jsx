import { useState, useEffect } from "react";
import { getFavorites, getTrips, deleteTrip, editTrip, exportTrip  } from "../services/weatherApi";
import { formatDate } from "../utils/formatDate";
import { X, Star, Trash2, Pencil, Download } from "lucide-react";

export default function Sidebar({sidebarOpen, setSidebarOpen, favoritesVersion, tripsVersion, onTripSelect, onFavoriteSelect }) {
    const [favorites, setFavorites] = useState([]);
    const [trips, setTrips] = useState([]);
    const [hoveredTrip, setHoveredTrip] = useState(null);
    const [showDownload, setShowDownload] = useState(null);
    const [editingTrip, setEditingTrip] = useState(null)
    const [editDep, setEditDep] = useState("");
    const [editRet, setEditRet] = useState("");

    const fetchFavorites = async () => {
        try {
            const data = await getFavorites();
            setFavorites(data);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchTrips = async () => {
        try {
            const data = await getTrips();
            setTrips(data.filter(t => t.departure_date && t.return_date));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [favoritesVersion]);

    useEffect(() => {
        fetchTrips();
    }, [tripsVersion]);

    const handleDelete = async (tripId, e) => {
        e.stopPropagation();
        try {
            await deleteTrip(tripId);
            fetchTrips(); // recarga la lista
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditSave = async () => {
        try {
            await editTrip(editingTrip.id, {
                departure_date: editDep,
                return_date: editRet
            });
            setEditingTrip(null);
            fetchTrips();
        } catch (error) {
            console.error(error);
        }
    };

    const handleExport = async (format, trip, e) => {
        e.stopPropagation();
        try {
            const response = await exportTrip(format, trip.id);
            const ext = format === "md" ? "md" : format;
            const url = URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `weather_${trip.id}.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
        {sidebarOpen && (
            <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}/>
        )}

        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

            <div className="sidebar-header">
                <h2>Travel Dashboard</h2>
                <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                    <X size={22} />
                </button>
            </div>

            <div className="sidebar-section">
                <h3>Favorites</h3>
                {favorites.map((favorite) => (
                    <div key={favorite.id} className="favorite-item"
                    onClick={() => { onFavoriteSelect(favorite); setSidebarOpen(false); }}>
                        <Star size={16} />
                        <span>{favorite.location_name}</span>
                    </div>
                ))}
            </div>

            <div className="sidebar-section">
                <h3>Search History</h3>
                {trips.map((trip) => {
                    const dep = formatDate(trip.departure_date.split("T")[0]);
                    const ret = formatDate(trip.return_date.split("T")[0]);

                    return (
                        <div key={trip.id} className="trip-item"
                            onClick={() => { onTripSelect(trip); setSidebarOpen(false); }}
                            onMouseEnter={() => setHoveredTrip(trip.id)}
                            onMouseLeave={() => {setHoveredTrip(null); setShowDownload(null);}}>
                            <div className="trip-info">
                                <span className="trip-location">{trip.location_name}</span>
                                <span className="trip-dates">{dep.date} → {ret.date}</span>
                            </div>

                            {hoveredTrip === trip.id && (
                            <div className="trip-actions" onClick={e => e.stopPropagation()}>
                                <button className="trip-action-btn" title="Download"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDownload(showDownload === trip.id ? null : trip.id);
                                    }}>
                                    <Download size={15} />
                                </button>

                                <button className="trip-action-btn" title="Edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTrip(trip);
                                        setEditDep(trip.departure_date.split("T")[0]);
                                        setEditRet(trip.return_date.split("T")[0]);
                                    }}>
                                    <Pencil size={15} />
                                </button>

                                <button className="trip-action-btn" title="Delete"
                                onClick={(e) => handleDelete(trip.id, e)}>
                                    <Trash2 size={15} />
                                </button>

                                {showDownload === trip.id && (
                                    <div className="download-popup">
                                        <span className="download-label">Download</span>
                                        {["json", "csv", "xml", "pdf", "md"].map(fmt => (
                                            <button key={fmt} className="download-btn"
                                                onClick={(e) => handleExport(fmt, trip, e)}>
                                                {fmt.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {editingTrip && (
            <div className="modal-overlay" onClick={() => setEditingTrip(null)}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <h3>Edit trip</h3>
                    <p className="modal-location">{editingTrip.location_name}</p>

                    <label>Departure</label>
                    <input type="date" className="modal-input"
                        value={editDep}
                        onChange={e => setEditDep(e.target.value)} />

                    <label>Return</label>
                    <input type="date" className="modal-input"
                        value={editRet}
                        onChange={e => setEditRet(e.target.value)} />

                    <div className="modal-actions">
                        <button className="modal-cancel" onClick={() => setEditingTrip(null)}>Cancel</button>
                        <button className="modal-save" onClick={handleEditSave}>Save</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}