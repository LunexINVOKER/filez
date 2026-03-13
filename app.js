import express from "express";
import db from "#db/client";

const app = express();
export default app;

app.use(express.json());

// GET /files — all files with folder_name
app.get("/files", async (req, res, next) => {
  try {
    const sql = `
    SELECT files.*, folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
    `;
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /folders — all folders
app.get("/folders", async (req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM folders");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /folders/:id — folder with files array
app.get("/folders/:id", async (req, res, next) => {
  try {
    const sql = `
    SELECT
      folders.*,
      COALESCE(json_agg(files.*) FILTER (WHERE files.id IS NOT NULL), '[]') AS files
    FROM folders
    LEFT JOIN files ON files.folder_id = folders.id
    WHERE folders.id = $1
    GROUP BY folders.id
    `;
    const { rows } = await db.query(sql, [req.params.id]);
    if (!rows.length) return res.status(404).send("Folder not found.");
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /folders/:id/files — create file in folder
app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const folder = await db.query("SELECT * FROM folders WHERE id = $1", [req.params.id]);
    if (!folder.rows.length) return res.status(404).send("Folder not found.");

    const { name, size } = req.body || {};
    if (!name || size === undefined) return res.status(400).send("Name and size are required.");

    const sql = "INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await db.query(sql, [name, size, req.params.id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal server error.");
});