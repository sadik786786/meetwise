import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

/* ============================
   POST → Send service request
   ============================ */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const seller_id = session.user.id;

    const {
      requirement_id,
      message,
      proposed_budget,
    } = await req.json();

    if (!requirement_id) {
      return NextResponse.json(
        { success: false, message: "requirement_id is required" },
        { status: 400 }
      );
    }

    // 🔍 Check if requirement exists
    const requirementCheck = await pool.query(
      "SELECT id FROM buyer_requirements WHERE id = $1",
      [requirement_id]
    );

    if (requirementCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Requirement not found" },
        { status: 404 }
      );
    }

    // 📤 Insert seller request
    const { rows } = await pool.query(
      `
      INSERT INTO seller_requests
        (seller_id, requirement_id, message, proposed_budget)
      VALUES
        ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        seller_id,
        requirement_id,
        message || null,
        proposed_budget || null,
      ]
    );

    return NextResponse.json(
      { success: true, data: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    // Duplicate request (same seller + requirement)
    if (error.code === "23505") {
      return NextResponse.json(
        { success: false, message: "Request already sent" },
        { status: 409 }
      );
    }

    console.error("Send Request Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* ============================
   GET → Seller requests with status
   ============================ */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const seller_id = session.user.id;

    const { rows } = await pool.query(
      `
      SELECT
        sr.id AS request_id,
        sr.status,
        sr.created_at AS request_date,

        br.id AS requirement_id,
        br.title,
        br.budget,
        br.category,
        br.urgency,
        br.created_at AS requirement_date
      FROM seller_requests sr
      JOIN buyer_requirements br
        ON br.id = sr.requirement_id
      WHERE sr.seller_id = $1
      ORDER BY sr.created_at DESC
      `,
      [seller_id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Seller Requests Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
