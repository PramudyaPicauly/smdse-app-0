import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			type: "credentials",
			credentials: {
				email: { label: "email", type: "text" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("invalid_credentials");
				}

				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user?.password) {
					throw new Error("invalid_email");
				}

				const isCorrectPassword = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isCorrectPassword) {
					throw new Error("invalid_password");
				}

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					position: user.position,
					role: user.role,
					isActive: user.isActive,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
		maxAge: 30 * 24 * 60 * 60,
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/signin",
		// error: "/",
		// signOut: "/auth/signin",
	},
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			return true;
		},
		// async redirect({ url, baseUrl }) {
		// 	return url.startsWith(baseUrl) ? url : baseUrl;
		// },
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.isActive = user.isActive;
				token.position = user.position;
			}
			return token;
		},
		async session({ session, token, user }) {
			const sess = {
				...session,
				user: {
					...session.user,
					id: token.id as string,
					role: token.role as string,
					position: token.position as string,
					isActive: token.isActive as string,
				},
			};

			return sess;
		},
	},
};

export default NextAuth(authOptions);
