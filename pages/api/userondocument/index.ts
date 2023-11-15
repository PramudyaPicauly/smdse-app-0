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
	const { docId } = req.body;

	if (session) {
		if (req.method === "GET") {
			const result = await prisma.userOnDocument.findMany({
				where: {
					recipientId: {
						equals: session.user?.id,
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			res.status(200).json(result);
		} else if (req.method === "PUT") {
			try {
				const result = await prisma.userOnDocument.updateMany({
					where: {
						AND: [
							{
								recipientId: session.user?.id,
							},
							{
								documentId: docId,
							},
						],
					},
					data: {
						isRead: true,
					},
				});
				res.status(200).json(result);
			} catch (error) {
				console.log(error);
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
