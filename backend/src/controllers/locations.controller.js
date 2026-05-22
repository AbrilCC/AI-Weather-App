import { getLocationSuggestions } from "../services/geocoding.service.js";

export const autocompleteLocations = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await getLocationSuggestions(q);
    res.json(results);

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};