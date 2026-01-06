import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

/* ============================
   GET → Browse all requirements
   ============================ */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        title,
        budget,
        deadline,
        category,
        urgency,
        created_at
      FROM buyer_requirements
      ORDER BY created_at DESC
      `
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Get Requirements Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
