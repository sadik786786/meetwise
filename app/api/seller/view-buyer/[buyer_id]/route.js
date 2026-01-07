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
