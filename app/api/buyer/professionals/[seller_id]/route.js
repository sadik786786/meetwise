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
     3️⃣ Check if already viewed
  --------------------------------*/
  const viewedRes = await pool.query(
    `SELECT 1 FROM viewed_profiles
     WHERE buyer_id = $1 AND seller_user_id = $2`,
    [buyer_id, seller_user_id]
  );

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
