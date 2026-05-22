import {
  createTrip,
  getTrips,
  editTrip,
  deleteTrip,
  exportTrip
} from "../services/searches.service.js";

export const postTrip = async (req, res) => {
  try {
    const trip = await createTrip(req.body);
    res.status(201).json(trip);

  } catch (error) {
    console.error("POST SEARCH ERROR:", error);
    res.status(500).json({error: error.message});
  }
};

export const getTripsController = async (req, res) => {
  try {
    const trips = await getTrips();
    res.status(200).json(trips);

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const patchTrip = async (req, res) => {
  try {
    const updatedTrip = await editTrip(req.params.id, req.body);
    res.status(200).json(updatedTrip);

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const deleteTripController = async (req, res) => {
  try {
    await deleteTrip(req.params.id);
    res.status(200).json({message: "Trip deleted"});

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const exportTripController = async (req, res) => {
    try {
        const { format, id } = req.body;
        const { contentType, data, ext } = await exportTrip(format, id);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="weather_export.${ext}"`);
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};