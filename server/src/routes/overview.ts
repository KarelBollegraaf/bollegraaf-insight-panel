import { Router } from "express";
import pool from "../db.js";

export const overviewRouter = Router();

overviewRouter.get("/", async (req, res) => {
  try {
    const from = typeof req.query.from === "string" ? req.query.from : null;
    const to = typeof req.query.to === "string" ? req.query.to : null;

    // Latest bale within selected timeframe
    const [latestRows]: any = await pool.query(
      `
      SELECT *
      FROM bale_cycle
      WHERE (? IS NULL OR ts >= ?)
        AND (? IS NULL OR ts <= ?)
      ORDER BY ts DESC, id DESC
      LIMIT 1
      `,
      [from, from, to, to]
    );

    // Summary stats within selected timeframe
    const [statsRows]: any = await pool.query(
      `
      SELECT
        COUNT(*) as total_bales,
        COALESCE(SUM(kwh_used), 0) as total_kwh,
        COALESCE(AVG(weight), 0) as avg_weight,
        COALESCE(AVG(volume), 0) as avg_volume,
        COALESCE(AVG(bale_length), 0) as avg_bale_length,
        COALESCE(AVG(oil_temperature), 0) as avg_oil_temperature,
        COALESCE(AVG(total_time), 0) as avg_total_time,
        COALESCE(SUM(total_time), 0) as sum_total_time,
        COALESCE(SUM(auto_time), 0) as sum_auto_time,
        COALESCE(SUM(standby_time), 0) as sum_standby_time,
        COALESCE(SUM(empty_time), 0) as sum_empty_time
      FROM bale_cycle
      WHERE (? IS NULL OR ts >= ?)
        AND (? IS NULL OR ts <= ?)
      `,
      [from, from, to, to]
    );

    // Material breakdown within selected timeframe
    const [materialRows]: any = await pool.query(
      `
      SELECT
        material_name,
        COUNT(*) as count,
        AVG(weight) as avg_weight,
        AVG(bale_length) as avg_length
      FROM bale_cycle
      WHERE (? IS NULL OR ts >= ?)
        AND (? IS NULL OR ts <= ?)
      GROUP BY material_name
      ORDER BY count DESC
      `,
      [from, from, to, to]
    );

    // Recent 24h bale count stays separate
    const [recent24h]: any = await pool.query(`
      SELECT COUNT(*) as count
      FROM bale_cycle
      WHERE ts >= NOW() - INTERVAL 24 HOUR
    `);

    res.json({
      latest: latestRows[0] || null,
      stats: statsRows[0] || null,
      materials: materialRows || [],
      recent24h: recent24h[0]?.count || 0,
    });
  } catch (err: any) {
    console.error("Overview error:", err);
    res.status(500).json({ error: err.message });
  }
});