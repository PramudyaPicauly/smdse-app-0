import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);

	if (session) {
		if (req.method === "GET") {
			const result = await prisma.document.findMany({
				where: {
					AND: [
						{
							type: "DISPOSISI",
						},
						{
							user: {
								id: {
									equals: session.user?.id,
								},
							},
						},
					],
				},
			});
			res.status(200).json(result);
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
