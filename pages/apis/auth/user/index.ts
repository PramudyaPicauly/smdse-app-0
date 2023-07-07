// NEXT
import type { NextApiRequest, NextApiResponse } from "next";

// DEPENDENCIS
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	if (req.method === "GET") {
		if (session) {
			const result = await prisma.user.findUnique({
				where: {
					id: session.user.id,
				},
			});
			res.status(200).json(result);
		} else {
			res.status(401).json({ message: "Unauthorized" });
		}
	}
}
