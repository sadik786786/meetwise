import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* =======================
   PUT – Update requirement
======================= */
export async function PUT(req,{params}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const {id} = await params;
    const buyerId = session.user.id;
    const {
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
export async function DELETE(req,{params}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const buyerId = session.user.id;
    const { id } = await params;

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
