import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await pool.query(
    `
    UPDATE seller_subscriptions
    SET views_remaining = views_remaining - 1
    WHERE seller_id = $1
      AND plan_type = 'basic'
      AND views_remaining > 0
    `,
    [session.user.id]
  );

  return NextResponse.json({ success: true });
}
