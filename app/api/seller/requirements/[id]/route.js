import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

/* ============================
   GET → Single requirement
   ============================ */
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Requirement ID is required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        budget,
        deadline,
        category,
        urgency,
        created_at
      FROM buyer_requirements
      WHERE id = $1
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Requirement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Get Requirement Detail Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
