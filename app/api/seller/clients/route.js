import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sellerId = session.user.id;

  const { rows } = await pool.query(
    `
    SELECT
      sr.id AS request_id,
      sr.proposed_budget,
      sr.created_at,

      br.id AS requirement_id,
      br.title AS requirement_title,

      u.id AS buyer_id,
      u.name AS buyer_name,
      u.email
    FROM seller_requests sr
    JOIN buyer_requirements br ON br.id = sr.requirement_id
    JOIN users u ON u.id = br.buyer_id
    WHERE sr.seller_id = $1
      AND sr.status = 'accepted'
    ORDER BY sr.created_at DESC
    `,
    [sellerId]
  );

  return NextResponse.json({ success: true, data: rows });
}
