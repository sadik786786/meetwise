import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import pool from "@/app/lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // 🔹 Runs on every sign in
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { email, name, image } = user;
        const googleId = account.providerAccountId;

        // 1️⃣ Check if user exists
        const existingUser = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );

        let userId;

        if (existingUser.rows.length === 0) {
          // 2️⃣ Create user
          const insertUser = await pool.query(
            `
            INSERT INTO users 
              (google_id, name, email, profile_image, is_profile_complete, active_role)
            VALUES ($1, $2, $3, $4, false, 'buyer')
            RETURNING id
            `,
            [googleId, name, email, image]
          );

          userId = insertUser.rows[0].id;
        } else {
          userId = existingUser.rows[0].id;
        }

        // 3️⃣ Ensure buyer profile exists
        await pool.query(
          `
          INSERT INTO buyer_profiles (user_id)
          VALUES ($1)
          ON CONFLICT (user_id) DO NOTHING
          `,
          [userId]
        );
      }

      return true;
    },

    // 🔹 Attach DB fields to session
    async session({ session }) {
      if (!session?.user?.email) return session;

      const result = await pool.query(
        `
        SELECT id, active_role, is_profile_complete
        FROM users
        WHERE email = $1
        `,
        [session.user.email]
      );

      if (result.rows.length > 0) {
        const dbUser = result.rows[0];

        session.user.id = dbUser.id;
        session.user.role = dbUser.active_role;
        session.user.isProfileComplete = dbUser.is_profile_complete;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
