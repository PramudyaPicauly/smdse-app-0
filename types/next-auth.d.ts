import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			position: string;
			role: string;
			isActive: boolean;
		};
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: {
			id: string;
			name: string;
			email: string;
			position: string;
			role: string;
			isActive: boolean;
		};
	}
}
