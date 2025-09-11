import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { checkAndSeedUserData } from "./seed-user-data";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      name: {
        type: "string",
        required: false,
      },
      image: {
        type: "string",
        required: false,
      },
    },
  },
  // Add proper error handling
  onAPIError: {
    throw: true,
    onError: (error, ctx) => {
      console.error("Better Auth API Error:", error);
      console.error("Context:", ctx);
    },
  },
  // Add callback for user creation to seed data
  callbacks: {
    onSuccess: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signUp: async (ctx: any) => {
        if (ctx.user?.id) {
          console.log(`New user created: ${ctx.user.email} (ID: ${ctx.user.id})`);
          // Seed data for the new user asynchronously
          checkAndSeedUserData(ctx.user.id).catch(error => {
            console.error("Failed to seed data for new user:", error);
          });
        }
        return ctx;
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
