import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

/* ============================
   PATCH → Accept / Reject request
   ============================ */
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const buyer_id = session.user.id;
    const {id} = await params;
    const request_id = id;
    const { status } = await req.json();

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    // 🔍 Verify request belongs to buyer
    const { rows } = await pool.query(
      `
      SELECT
        sr.id,
        sr.status,
        br.buyer_id
      FROM seller_requests sr
      JOIN buyer_requirements br
        ON br.id = sr.requirement_id
      WHERE sr.id = $1
      `,
      [request_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    const request = rows[0];

    if (request.buyer_id !== buyer_id) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Request already processed" },
        { status: 409 }
      );
    }

    // 🔄 Update request status
    const update = await pool.query(
      `
      UPDATE seller_requests
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, request_id]
    );

    return NextResponse.json({
      success: true,
      data: update.rows[0],
    });
  } catch (error) {
    console.error("Buyer Request Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
