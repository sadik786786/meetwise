import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* =======================
   GET – Fetch buyer requirements
======================= */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const buyerId = session.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM buyer_requirements
      WHERE buyer_id = $1
      ORDER BY created_at DESC
      `,
      [buyerId]
    );

    return new Response(
      JSON.stringify({ requirements: result.rows }),
      { status: 200 }
    );

  } catch (error) {
    console.error("GET buyer requirements error:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}

/* =======================
   POST – Create requirement
======================= */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const buyerId = session.user.id;
    const {
      title,
      description,
      budget,
      deadline,
      category,
      urgency
    } = await req.json();

    if (!title || !description) {
      return new Response(
        JSON.stringify({ message: "Title and description are required" }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO buyer_requirements
        (buyer_id, title, description, budget, deadline, category, urgency)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        buyerId,
        title,
        description,
        budget || null,
        deadline || null,
        category || null,
        urgency || "medium"
      ]
    );

    return new Response(
      JSON.stringify({ requirement: result.rows[0] }),
      { status: 201 }
    );

  } catch (error) {
    console.error("POST requirement error:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}

/* =======================
   PUT – Update requirement
======================= */
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const buyerId = session.user.id;
    const {
      id,
      title,
      description,
      budget,
      deadline,
      category,
      urgency
    } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Requirement ID required" }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      UPDATE buyer_requirements
      SET
        title = $1,
        description = $2,
        budget = $3,
        deadline = $4,
        category = $5,
        urgency = $6,
        updated_at = NOW()
      WHERE id = $7 AND buyer_id = $8
      RETURNING *
      `,
      [
        title,
        description,
        budget || null,
        deadline || null,
        category || null,
        urgency || "medium",
        id,
        buyerId
      ]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Requirement not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ requirement: result.rows[0] }),
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT requirement error:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}

/* =======================
   DELETE – Delete requirement
======================= */
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const buyerId = session.user.id;
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Requirement ID required" }),
        { status: 400 }
      );
    }

    await pool.query(
      `
      DELETE FROM buyer_requirements
      WHERE id = $1 AND buyer_id = $2
      `,
      [id, buyerId]
    );

    return new Response(
      JSON.stringify({ message: "Requirement deleted successfully" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE requirement error:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
