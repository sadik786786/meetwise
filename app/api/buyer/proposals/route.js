import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

/* ============================
   GET → Buyer view seller proposals
   ============================ */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const buyer_id = session.user.id;

    const { rows } = await pool.query(
      `
      SELECT
        sr.id AS request_id,
        sr.status,
        sr.message,
        sr.proposed_budget,
        sr.created_at,

        br.id AS requirement_id,
        br.title AS requirement_title,

        u.id AS seller_id,
        u.name AS seller_name,

        sp.title AS seller_title,
        sp.experience_years,
        sp.country
      FROM seller_requests sr
      JOIN buyer_requirements br ON br.id = sr.requirement_id
      JOIN users u ON u.id = sr.seller_id
      LEFT JOIN seller_profiles sp ON sp.user_id = u.id
      WHERE br.buyer_id = $1
      ORDER BY sr.created_at DESC
      `,
      [buyer_id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Buyer Proposals Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
