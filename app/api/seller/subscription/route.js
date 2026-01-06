import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/* ======================
   GET → Seller subscription
   ====================== */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rows } = await pool.query(
    `
    SELECT *
    FROM seller_subscriptions
    WHERE seller_id = $1 AND is_active = true
    `,
    [session.user.id]
  );

  return NextResponse.json({ data: rows[0] || null });
}

/* ======================
   POST → Buy seller plan
   ====================== */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan_type } = await req.json();

  const views =
    plan_type === "basic" ? 5 : 999999; // lifetime = unlimited

  // Deactivate old subscription
  await pool.query(
    `
    UPDATE seller_subscriptions
    SET is_active = false
    WHERE seller_id = $1
    `,
    [session.user.id]
  );

  // Create new subscription
  const { rows } = await pool.query(
    `
    INSERT INTO seller_subscriptions
    (seller_id, plan_type, views_remaining)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [session.user.id, plan_type, views]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
