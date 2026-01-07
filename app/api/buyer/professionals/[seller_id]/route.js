import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const buyer_id = session.user.id;
    const { seller_id } = await params;

    /* 1️⃣ Get seller user_id */
    const sellerRes = await pool.query(
      `SELECT user_id FROM seller_profiles WHERE id = $1`,
      [seller_id]
    );

    if (sellerRes.rowCount === 0) {
      return NextResponse.json(
        { error: "SELLER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const seller_user_id = sellerRes.rows[0].user_id;

    /* ❌ Prevent self view */
    if (seller_user_id === buyer_id) {
      return NextResponse.json(
        { error: "CANNOT_VIEW_SELF" },
        { status: 400 }
      );
    }

    /* 2️⃣ Track view (optional but recommended) */
    await pool.query(
      `
      INSERT INTO viewed_profiles (buyer_id, seller_user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      `,
      [buyer_id, seller_user_id]
    );

    /* 3️⃣ Return seller profile */
    const profileRes = await pool.query(
      `
      SELECT
        u.id AS seller_user_id,
        u.name,
        u.email,
        u.profile_image,
        sp.*
      FROM users u
      JOIN seller_profiles sp ON sp.user_id = u.id
      WHERE u.id = $1
      `,
      [seller_user_id]
    );

    return NextResponse.json({
      success: true,
      data: profileRes.rows[0],
    });

  } catch (error) {
    console.error("Seller profile error:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
