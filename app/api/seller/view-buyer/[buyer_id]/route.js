import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const {buyer_id} = await params;
  const id = buyer_id;
  const buyers_id = await pool.query(`SELECT buyer_id FROM buyer_requirements WHERE id = $1`, [id]);
  const seller_id = session.user.id;
  
  // 1️⃣ Check seller subscription
  const subRes = await pool.query(`
    SELECT * FROM seller_subscriptions
    WHERE seller_id = $1 AND is_active = true
  `, [seller_id]);

  if (subRes.rowCount === 0) {
    return Response.json(
      { error: "SUBSCRIPTION_REQUIRED" },
      { status: 403 }
    );
  }

  const subscription = subRes.rows[0];

  // 2️⃣ Check if buyer already viewed
  const viewed = await pool.query(`
    SELECT 1 FROM viewed_buyers
    WHERE seller_id = $1 AND buyer_id = $2
  `, [seller_id, buyers_id.rows[0].buyer_id]);

  // 3️⃣ Reduce view count for basic plan
  if (
    subscription.plan_type === "basic" &&
    viewed.rowCount === 0
  ) {
    if (subscription.views_remaining <= 0) {
      return Response.json(
        { error: "VIEW_LIMIT_REACHED" },
        { status: 403 }
      );
    }

    await pool.query(`
      UPDATE seller_subscriptions
      SET views_remaining = views_remaining - 1
      WHERE seller_id = $1
    `, [seller_id]);
  }

  // 4️⃣ Mark buyer as viewed
  if (viewed.rowCount === 0) {
    await pool.query(`
      INSERT INTO viewed_buyers (seller_id, buyer_id)
      VALUES ($1, $2)
    `, [seller_id, buyers_id.rows[0].buyer_id]);
  }

  // 5️⃣ Return buyer full profile
  const buyer = await pool.query(`
    SELECT
      id,
      company_name,
      location,
      phone
    FROM buyer_profiles
    WHERE user_id = $1
  `, [buyers_id.rows[0].buyer_id]);
   const user = await pool.query(`
    SELECT
      name, email,profile_image
    FROM users
    WHERE id = $1
  `, [buyers_id.rows[0].buyer_id]);
  return Response.json({
    success: true,
    data: {...buyer.rows[0], ...user.rows[0]},
  });
}
