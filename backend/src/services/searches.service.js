import axios from "axios";
import dotenv from "dotenv";
import PDFDocument from "pdfkit";
import { create as createXml } from "xmlbuilder2";
import client from "../config/supabaseClient.js";

import { getCoordinates } from "./geocoding.service.js";

dotenv.config();

export const createTrip = async (data) => {
    try{
        const { location_name, latitude, longitude,
            departure_date, return_date,
            temperature, weather_description} = data;
        
        const existingTrip = await client.query(`
            SELECT * FROM weather_searches
            WHERE latitude = $1
            AND longitude = $2
            AND departure_date IS NOT DISTINCT FROM $3
            AND return_date IS NOT DISTINCT FROM $4
        `, [latitude, longitude, departure_date, return_date]);
        if (existingTrip.rows.length > 0) {
            return existingTrip.rows[0];
        }
        
        const trip = await client.query(`
            INSERT INTO weather_searches
            (location_name, latitude, longitude,
            departure_date, return_date,
            temperature, weather_description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [location_name, latitude, longitude, departure_date, return_date, temperature, weather_description]
        );
        return trip.rows[0];
    } catch (error) {
        console.error("SERVICE ERROR:", error);
        throw new Error(error.message);        
    }
};

export const getTrips = async () => {
    try {
        const trips = await client.query(`
            SELECT * FROM weather_searches`);
        return trips.rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editTrip = async (id, data) => {
    try {
        const { departure_date, return_date } = data;
        const trip = await client.query(`
            UPDATE weather_searches
            SET departure_date = $1, return_date = $2
            WHERE id = $3
            RETURNING *`, [departure_date, return_date, id]);
        return trip.rows[0];
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteTrip = async (id) => {
    try {
        await client.query("DELETE FROM weather_searches WHERE id = $1", [id]);
    } catch (error) {
        throw new Error(error.message);
    }
};


export const exportTrip = async (format, id) => {
    const result = await client.query(
        `SELECT * FROM weather_searches WHERE id = $1`, [id]
    );
    const rows = result.rows;

    if (format === "json") {
        return { contentType: "application/json", data: JSON.stringify(rows, null, 2), ext: "json" };
    }

    if (format === "csv") {
        const headers = ["id","location_name","latitude","longitude","departure_date","return_date","temperature","created_at"];
        const lines = [headers.join(","), ...rows.map(r =>
            headers.map(h => JSON.stringify(r[h] ?? "")).join(",")
        )];
        return { contentType: "text/csv", data: lines.join("\n"), ext: "csv" };
    }

    if (format === "xml") {
        const doc = createXml({ version: "1.0" }).ele("searches");
        rows.forEach(r => {
            const s = doc.ele("search");
            Object.entries(r).forEach(([k, v]) => s.ele(k).txt(v ?? ""));
        });
        return { contentType: "application/xml", data: doc.end({ prettyPrint: true }), ext: "xml" };
    }

    if (format === "pdf") {
        return new Promise((resolve) => {
            const doc = new PDFDocument();
            const chunks = [];
            doc.on("data", chunk => chunks.push(chunk));
            doc.on("end", () => resolve({
                contentType: "application/pdf",
                data: Buffer.concat(chunks),
                ext: "pdf"
            }));
            
            doc.fontSize(16).text("Weather Search History", { underline: true });
            doc.moveDown();
            rows.forEach(r => {
                doc.fontSize(12).text(`${r.location_name} — ${r.departure_date?.toISOString().split("T")[0] ?? ""} → ${r.return_date?.toISOString().split("T")[0] ?? ""}`);
                doc.fontSize(10).fillColor("gray").text(`Temperature: ${r.temperature ?? "N/A"} | Searched: ${r.created_at?.toISOString().split("T")[0]}`);
                doc.fillColor("white").moveDown();
            });
            doc.end();
        });
    }

    if (format === "md") {
        const headers = ["id","location_name","departure_date","return_date","temperature"];
        const lines = [
            `| ${headers.join(" | ")} |`,
            `| ${headers.map(() => "---").join(" | ")} |`,
            ...rows.map(r => `| ${headers.map(h => r[h] ?? "").join(" | ")} |`)
        ];
        return { contentType: "text/markdown", data: lines.join("\n"), ext: "md" };
    }

    throw new Error("Unsupported format");
};