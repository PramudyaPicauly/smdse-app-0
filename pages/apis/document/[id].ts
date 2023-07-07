// NEXT
import type { NextApiRequest, NextApiResponse } from "next";

// DEPENDENCY
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	const { email, password, name, position, role, isActive } = req.body;
	const id = req.query.id as string;

	if (req.method === "GET") {
		const result = await prisma.user.findUnique({
			where: {
				id,
			},
		});
		res.status(200).json(result);
	} else if (req.method === "POST") {
		const resultt = await prisma.user.findUnique({
			where: {
				id,
			},
		});
		const result = await prisma.user.update({
			where: {
				id,
			},
			data: {
				email: email ? email : resultt?.email,
				password: password ? password : resultt?.password,
				name: name ? name : resultt?.name,
				position: position ? position : resultt?.position,
				role: role ? role : resultt?.role,
			},
		});
		res.status(200).json(result);
	}
}
