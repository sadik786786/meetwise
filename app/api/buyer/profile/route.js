import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const result = await pool.query(
      `
      SELECT
        u.id AS user_id,
        u.name,
        u.email,
        u.profile_image,
        u.active_role,
        bp.company_name,
        bp.requirements,
        bp.phone,
        bp.location,
        bp.created_at,
        bp.updated_at
      FROM users u
      LEFT JOIN buyer_profiles bp ON bp.user_id = u.id
      WHERE u.id = $1 AND u.active_role = 'buyer'
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Buyer not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ profile: result.rows[0] }),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET buyer profile error:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { company_name, requirements, phone, location } = await req.json();

    if (!phone || !location) {
      return new Response(
        JSON.stringify({ message: "Phone and location are required" }),
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO buyer_profiles (
        user_id,
        company_name,
        requirements,
        phone,
        location
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
        company_name = EXCLUDED.company_name,
        requirements = EXCLUDED.requirements,
        phone = EXCLUDED.phone,
        location = EXCLUDED.location,
        updated_at = CURRENT_TIMESTAMP
      `,
      [userId, company_name, requirements, phone, location]
    );

    return new Response(
      JSON.stringify({ message: "Buyer profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT buyer profile error:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
