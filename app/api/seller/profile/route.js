import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

/* ============================
   Helper → Get user from session
   ============================ */
async function getUserId() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return null;
  }

  return session.user.id;
}

/* ============================
   GET → Show seller profile
   ============================ */
export async function GET() {
  try {
    const user_id = await getUserId();

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { rows } = await pool.query(
      "SELECT * FROM seller_profiles WHERE user_id = $1",
      [user_id]
    );

    return NextResponse.json({
      success: true,
      data: rows[0] || null,
    });
  } catch (error) {
    console.error("GET Seller Profile Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   POST → Add seller profile
   ============================ */
export async function POST(req) {
  try {
    const user_id = await getUserId();

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      title,
      skills,
      experience_years,
      bio,
      country,
    } = await req.json();

    const { rows } = await pool.query(
      `
      INSERT INTO seller_profiles
        (user_id, title, skills, experience_years, bio, country)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        user_id,
        title || null,
        skills || null,
        experience_years || null,
        bio || null,
        country || null,
      ]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Seller Profile Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   PUT → Edit seller profile
   ============================ */
export async function PUT(req) {
  try {
    const user_id = await getUserId();

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      title,
      skills,
      experience_years,
      bio,
      country,
    } = await req.json();

    const { rows } = await pool.query(
      `
      UPDATE seller_profiles
      SET
        title = $2,
        skills = $3,
        experience_years = $4,
        bio = $5,
        country = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *
      `,
      [
        user_id,
        title || null,
        skills || null,
        experience_years || null,
        bio || null,
        country || null,
      ]
    );

    return NextResponse.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("PUT Seller Profile Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   DELETE → Delete seller profile
   ============================ */
export async function DELETE() {
  try {
    const user_id = await getUserId();

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await pool.query(
      "DELETE FROM seller_profiles WHERE user_id = $1",
      [user_id]
    );

    return NextResponse.json({
      success: true,
      message: "Seller profile deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Seller Profile Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
