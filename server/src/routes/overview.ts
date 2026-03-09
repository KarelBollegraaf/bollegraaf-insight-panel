import { Router } from "express";
import pool from "../db.js";

export const overviewRouter = Router();

overviewRouter.get("/", async (_req, res) => {
  try {
    // Latest bale
    const [latestRows]: any = await pool.query(
      `SELECT * FROM bale_cycle ORDER BY ts DESC LIMIT 1`
    );

    // Summary stats
    const [statsRows]: any = await pool.query(`
      SELECT
        COUNT(*) as total_bales,
        SUM(kwh_used) as total_kwh,
        AVG(weight) as avg_weight,
        AVG(volume) as avg_volume,
        AVG(bale_length) as avg_bale_length,
        AVG(oil_temperature) as avg_oil_temperature,
        AVG(total_time) as avg_total_time,
        SUM(total_time) as sum_total_time,
        SUM(auto_time) as sum_auto_time,
        SUM(standby_time) as sum_standby_time,
        SUM(empty_time) as sum_empty_time
      FROM bale_cycle
    `);

    // Bales per material
    const [materialRows]: any = await pool.query(`
      SELECT material_name, COUNT(*) as count, AVG(weight) as avg_weight, AVG(bale_length) as avg_length
      FROM bale_cycle
      GROUP BY material_name
      ORDER BY count DESC
    `);

    // Recent 24h bale count
    const [recent24h]: any = await pool.query(`
      SELECT COUNT(*) as count FROM bale_cycle WHERE ts >= NOW() - INTERVAL 24 HOUR
    `);

    res.json({
      latest: latestRows[0] || null,
      stats: statsRows[0] || null,
      materials: materialRows,
      recent24h: recent24h[0]?.count || 0,
    });
  } catch (err: any) {
    console.error("Overview error:", err);
    res.status(500).json({ error: err.message });
  }
});
