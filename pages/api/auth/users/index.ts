// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// NEXT
import type { NextApiRequest, NextApiResponse } from "next";

// DEPENDENCY
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);

	if (req.method === "GET") {
		// GET ALL USER
		if (session) {
			const result = await prisma.user.findMany({
				select: {
					id: true,
					email: true,
					name: true,
					position: true,
					role: true,
					isActive: true,
				},
			});
			res.status(200).json(result);
		} else {
			res.status(401).json({ message: "Unauthorized" });
		}
	} else if (req.method === "POST") {
		// CREATE A USER
		const { signUpCredentials } = req.body;
		const hashedPassword = await bcrypt.hash(signUpCredentials.password, 12);
		const result = await prisma.user.create({
			data: {
				email: signUpCredentials.email,
				password: hashedPassword,
				name: signUpCredentials.name,
				position: signUpCredentials.position,
				role: signUpCredentials.role,
			},
		});
		res.status(200).json(result);
	}
}
