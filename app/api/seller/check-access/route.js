import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST() {
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

  if (rows.length === 0) {
    return NextResponse.json({ allowed: false });
  }

  const sub = rows[0];

  if (sub.plan_type === "basic" && sub.views_remaining <= 0) {
    return NextResponse.json({ allowed: false });
  }

  return NextResponse.json({ allowed: true });
}
