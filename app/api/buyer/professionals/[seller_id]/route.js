import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import pool from "@/app/lib/db";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const buyer_id = session.user.id;
  const { seller_id } = await params; // seller profile id from URL

  /* -------------------------------
     1️⃣ Get seller user_id
  --------------------------------*/
  const sellerRes = await pool.query(
    `SELECT user_id FROM seller_profiles WHERE id = $1`,
    [seller_id]
  );

  if (sellerRes.rowCount === 0) {
    return Response.json(
      { error: "SELLER_NOT_FOUND" },
      { status: 404 }
    );
  }

  const seller_user_id = sellerRes.rows[0].user_id;

  /* -------------------------------
     2️⃣ Check subscription
  --------------------------------*/
  const subRes = await pool.query(
    `SELECT * FROM buyer_subscriptions
     WHERE buyer_id = $1 AND is_active = true`,
    [buyer_id]
  );

  if (subRes.rowCount === 0) {
    return Response.json(
      { error: "SUBSCRIPTION_REQUIRED" },
      { status: 403 }
    );
  }

  const subscription = subRes.rows[0];

  /* -------------------------------
     3️⃣ Check if already viewed
  --------------------------------*/
  const viewedRes = await pool.query(
    `SELECT 1 FROM viewed_profiles
     WHERE buyer_id = $1 AND seller_user_id = $2`,
    [buyer_id, seller_user_id]
  );

  /* -------------------------------
     4️⃣ Reduce views (basic plan)
  --------------------------------*/
  if (
    subscription.plan_type === "basic" &&
    viewedRes.rowCount === 0
  ) {
    if (subscription.views_remaining <= 0) {
      return Response.json(
        { error: "VIEW_LIMIT_REACHED" },
        { status: 403 }
      );
    }

    await pool.query(
      `UPDATE buyer_subscriptions
       SET views_remaining = views_remaining - 1
       WHERE buyer_id = $1`,
      [buyer_id]
    );
  }

  /* -------------------------------
     5️⃣ Mark profile as viewed
  --------------------------------*/
  if (viewedRes.rowCount === 0) {
    await pool.query(
      `INSERT INTO viewed_profiles (buyer_id, seller_user_id)
       VALUES ($1, $2)`,
      [buyer_id, seller_user_id]
    );
  }

  /* -------------------------------
     6️⃣ Return seller profile
  --------------------------------*/
  const profileRes = await pool.query(
    `
    SELECT
      u.id as seller_user_id,
      u.name,
      u.email,
      u.profile_image,
      sp.*
    FROM users u
    JOIN seller_profiles sp ON sp.user_id = u.id
    WHERE u.id = $1
    `,
    [seller_user_id]
  );

  return Response.json({
    success: true,
    data: profileRes.rows[0],
  });
}
