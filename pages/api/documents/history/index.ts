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

	if (session) {
		// GET ALL SENT DOCUMENT
		if (req.method === "GET") {
			try {
				const getDoc = await prisma.document.findMany({
					where: {
						AND: [
							{
								isDone: true,
							},
							{
								author: {
									id: {
										not: session?.user?.id,
									},
								},
							},
							{
								recipients: {
									some: {
										recipientId: session?.user?.id,
									},
								},
							},
						],
					},
					select: {
						id: true,
						content: true,
						type: true,
						author: true,
						authorId: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				});
				res.status(200).json(getDoc);
			} catch (error) {
				res.status(500).json({ message: "Failed to Get Document" });
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
