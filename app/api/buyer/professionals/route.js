import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(`
  SELECT
    sp.id AS seller_id,
    sp.title,
    sp.skills,
    sp.experience_years,
    sp.country
  FROM seller_profiles sp
  ORDER BY sp.created_at DESC
`);


    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load professionals" },
      { status: 500 }
    );
  }
}
