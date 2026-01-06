import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const sellerId = session.user.id;
    const userdata = await pool.query("SELECT name,email,profile_image,created_at FROM users WHERE id = $1",[sellerId])
    //profile data
    const profile = await pool.query("SELECT id , title , skills FROM seller_profiles WHERE user_id = $1",[sellerId])
    // Total requests
    const totalRequests = await pool.query(
      "SELECT COUNT(*) FROM seller_requests WHERE seller_id = $1",
      [sellerId]
    );

    // Accepted requests
    const acceptedRequests = await pool.query(
      "SELECT COUNT(*) FROM seller_requests WHERE seller_id = $1 AND status = 'accepted'",
      [sellerId]
    );

    // Subscription
    const subscription = await pool.query(
      "SELECT plan_type FROM seller_subscriptions WHERE seller_id = $1 AND is_active = 'true'",
      [sellerId]
    );

    // Recent requests
    const recentRequests = await pool.query(
      `
      SELECT
        br.title,
        br.budget,
        u.name AS buyer_name,
        sr.status
      FROM seller_requests sr
      JOIN buyer_requirements br ON sr.requirement_id = br.id
      JOIN users u ON br.buyer_id = u.id
      WHERE sr.seller_id = $1
      ORDER BY sr.created_at DESC
      LIMIT 5
      `,
      [sellerId]
      
    );
    return NextResponse.json({
      success: true,
      data: {
        totalRequests: totalRequests.rows[0].count,
        acceptedRequests: acceptedRequests.rows[0].count,
        plan: subscription.rows[0]?.plan_type || 'Free',
        recentRequests: recentRequests.rows,
        userdata : userdata.rows[0],
        profile : profile.rows[0]
      },
    });

  } catch (error) {
    console.error("Seller dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
