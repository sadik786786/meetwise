import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

/* ------------------- QUERIES ------------------- */

const GET_SELLER_REQUEST = `
  SELECT
    id,
    status,
    message,
    proposed_budget,
    requirement_id,
    created_at
  FROM seller_requests
  WHERE id = $1
    AND seller_id = $2
`;

const GET_BUYER_REQUIREMENT = `
  SELECT
    id,
    title,
    description,
    budget,
    deadline,
    category,
    urgency
  FROM buyer_requirements
  WHERE id = $1
`;

/* ------------------- API ------------------- */

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const seller_id = session.user.id;
    const { id } = await params; // seller_request id
    /* 1️⃣ Fetch seller request */
    const sellerRequestRes = await pool.query(
      `
  SELECT
    id,
    status,
    message,
    proposed_budget,
    requirement_id,
    created_at
  FROM seller_requests
  WHERE requirement_id = $1
    AND seller_id = $2
`,
      [id, seller_id]
    );

    if (!sellerRequestRes.rows.length) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    const sellerRequest = sellerRequestRes.rows[0];

    /* 2️⃣ Fetch buyer requirement */
    const requirementRes = await pool.query(
       `
  SELECT
    id,
    title,
    description,
    budget,
    deadline,
    category,
    urgency
  FROM buyer_requirements
  WHERE id = $1
`,
      [id]
    );

    if (!requirementRes.rows.length) {
      return NextResponse.json(
        { message: "Requirement not found" },
        { status: 404 }
      );
    }

    const requirement = requirementRes.rows[0];
    /* 3️⃣ Merge response */
    return NextResponse.json({
      success: true,
      data: {
        request: sellerRequest,
        requirement: requirement
      }
    });

  } catch (err) {
    console.error("GET seller request error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const seller_id = session.user.id;
    const {id} = await params;
    const { message, proposed_budget } = await req.json();

    const { rows } = await pool.query(
      `
      UPDATE seller_requests
      SET message = $1,
          proposed_budget = $2
      WHERE id = $3
        AND seller_id = $4
        AND status = 'pending'
      RETURNING *
      `,
      [message, proposed_budget, id, seller_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { message: "Cannot edit this request" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const seller_id = session.user.id;
    const {id} = await params;
    const request_id = id;
    const result = await pool.query(
      `
      DELETE FROM seller_requests
      WHERE id = $1
        AND seller_id = $2
        AND status = 'pending' or status = 'rejected'
      RETURNING *
      `,
      [request_id, seller_id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Cannot delete this request" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
