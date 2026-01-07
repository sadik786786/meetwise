import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const buyerId = session.user.id;

    // User basic data
    const userdata = await pool.query(
      "SELECT name, email, profile_image, created_at FROM users WHERE id = $1",
      [buyerId]
    );

    // Buyer profile
    const profile = await pool.query(
      "SELECT id, company_name, location FROM buyer_profiles WHERE user_id = $1",
      [buyerId]
    );

    // Total requirements posted
    const totalRequirements = await pool.query(
      "SELECT COUNT(*) FROM buyer_requirements WHERE buyer_id = $1",
      [buyerId]
    );

    // Recent requirements
    const recentRequirements = await pool.query(
      `
      SELECT
        title,
        budget,
        category,
        created_at,
        deadline
      FROM buyer_requirements
      WHERE buyer_id = $1
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [buyerId]
    );

    return NextResponse.json({
      success: true,
      data: {
        totalRequirements: totalRequirements.rows[0].count,
        recentRequirements: recentRequirements.rows,
        userdata: userdata.rows[0],
        profile: profile.rows[0],
      },
    });

  } catch (error) {
    console.error("Buyer dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
