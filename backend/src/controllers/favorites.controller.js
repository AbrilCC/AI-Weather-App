import client from "../config/supabaseClient.js";

export const getFavorites = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM favorite_locations
      ORDER BY created_at DESC
    `);
    res.json(result.rows);

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { location_name, latitude, longitude } = req.body;

    const existing = await client.query(`
        SELECT * FROM favorite_locations
        WHERE location_name = $1 AND latitude = $2 AND longitude = $3`,
    [location_name, latitude, longitude]);
    if (existing.rows.length > 0) {
        return res.status(200).json(existing.rows[0]);
    }

    const result = await client.query(`
      INSERT INTO favorite_locations
      (location_name, latitude, longitude)
      VALUES ($1, $2, $3)
      RETURNING *
      `, [location_name, latitude, longitude]
    );
    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const deleteFavorite = async (req, res) => {
    try {
        await client.query(`
            DELETE FROM favorite_locations
            WHERE id = $1`, [req.params.id]
        );
        res.json({message: "Favorite location deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};