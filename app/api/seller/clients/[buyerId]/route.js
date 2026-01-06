import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  try {
    const { buyerId } = await params;

    // Fetch user
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [buyerId]
    );

    // Fetch buyer profile
    const profileResult = await pool.query(
      "SELECT * FROM buyer_profiles WHERE user_id = $1",
      [buyerId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...userResult.rows[0],
        ...(profileResult.rows[0] || {}),
      },
    });

  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
