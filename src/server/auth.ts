import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type User,
  type Session,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/env.mjs";
import { prisma } from "@/server/db";

import GoogleProvider from "next-auth/providers/google";
import type { DefaultJWT } from "next-auth/jwt";
import axios from "axios";
// import { MixPanelServer } from "./analytics/mixpanel";

import Mixpanel from "mixpanel";
const mixpanel = Mixpanel.init(env.MIXPANEL_TOKEN);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      token: string | null;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    user: User | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

const scopes = [
  // "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      if (!session || !user) return session;
      if (session.user) {
        const newSession = await checkAndRefresh(session, user);
        if (newSession) return newSession;
        return session;
      }

      const newSession = await checkAndRefresh(session, user);
      if (newSession) return newSession;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  events: {
    async signIn({ user, account, isNewUser }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          accounts: true,
        },
      });

      if (!dbUser?.accounts[0] || !account) return;

      const dbAccount = dbUser?.accounts[0];

      if (isNewUser) {
        mixpanel.people.set(dbUser.id, {
          $email: dbUser.email,
          $name: dbUser.name,
          $created: new Date().toISOString(),
          $avatar: dbUser.image,
        });

        mixpanel.track("User Sign Up", {
          provider: dbAccount.provider,
          email: dbUser.email,
          name: dbUser.name,
          id: dbUser.id,
        });

        if (dbUser.isCreator) {
          mixpanel.track("Creator Sign Up", {
            provider: dbAccount.provider,
            email: dbUser.email,
            name: dbUser.name,
            id: dbUser.id,
          });
        }
      }

      if (dbUser.isCreator) {
        mixpanel.people.set(dbUser.id, {
          $email: dbUser.email,
          $name: dbUser.name,
          $created: new Date().toISOString(),
          $avatar: dbUser.image,
        });

        mixpanel.track("Creator Sign In", {
          provider: dbAccount.provider,
          email: dbUser.email,
          name: dbUser.name,
          id: dbUser.id,
        });
      } else {
        mixpanel.track("User Sign In", {
          provider: dbAccount.provider,
          email: dbUser.email,
          name: dbUser.name,
          id: dbUser.id,
        });
      }

      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: dbAccount.providerAccountId,
          },
        },
        data: {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        },
      });
    },
    createUser({ user }) {
      mixpanel.people.set(user.id, {
        $email: user.email,
        $name: user.name,
        $created: new Date().toISOString(),
        $avatar: user.image,
      });
    },
  },
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    // GithubProvider({
    //   clientId: env.GITHUB_CLIENT_ID,
    //   clientSecret: env.GITHUB_CLIENT_SECRET,
    // }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `openid ${scopes.join(" ")}`,
          prompt: "consent",
        },
      },
    }),
    // FacebookProvider({
    //   clientId: env.FACEBOOK_CLIENT_ID,
    //   clientSecret: env.FACEBOOK_CLIENT_SECRET,
    // }),
  ],
  // pages: {
  //   signIn: "/auth/sign-in",
  // },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

async function checkAndRefresh(session: Session, user: User) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { accounts: true },
  });

  session.user = {
    ...user,
    token: dbUser?.accounts[0]?.access_token ?? "",
  };

  const newSession = {
    ...session,
  };

  if (!dbUser?.accounts[0] || !dbUser.accounts[0].expires_at) return newSession;

  const now = Math.floor(Date.now() / 1000);
  const difference = Math.floor((dbUser?.accounts[0]?.expires_at - now) / 60);
  const refreshToken = dbUser?.accounts[0].refresh_token;

  if (difference < 5 && refreshToken) {
    try {
      const request = await axios.post<{
        access_token: string;
        expires_in: number;
        refresh_token: string;
      }>("https://oauth2.googleapis.com/token", null, {
        params: {
          client_id: env.GOOGLE_CLIENT_ID,
          client_secret: env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        },
      });

      if (!(request.status === 200)) {
        return newSession;
      }

      const { access_token, expires_in, refresh_token } = request.data;
      const timestamp = Math.floor((Date.now() + expires_in * 1000) / 1000);

      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: dbUser?.accounts[0].providerAccountId,
          },
        },
        data: {
          access_token,
          expires_at: timestamp,
          refresh_token,
        },
      });
      newSession.user.token = access_token;
      return newSession;
    } catch (e) {
      console.log(e);
      return newSession;
    }
  }
}
