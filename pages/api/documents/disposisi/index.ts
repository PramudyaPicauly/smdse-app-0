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
	const pij = req.query.page as string;
	const { docContent, docType, docId } = req.body;
	const session = await getServerSession(req, res, authOptions);

	if (session) {
		// GET ALL DOCUMENT
		if (req.method === "GET") {
			const getDoc = await prisma.document.findMany({
				where: {
					AND: [
						{
							type: "DISPOSISI",
						},
						{
							author: {
								id: {
									equals: session.user?.id,
								},
							},
						},
					],
				},
				select: {
					recipients: {
						select: {
							createdAt: true,
							recipientId: true,
							recipient: {
								select: {
									id: true,
									email: true,
									isActive: true,
									name: true,
									position: true,
									role: true,
								},
							},
						},
					},
					id: true,
					content: true,
					type: true,
					createdAt: true,
					author: true,
					authorId: true,
					isSent: true,
					isApproved: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: 5,
				skip: Number(pij) * 5,
			});
			res.status(200).json(getDoc);
		}
		// CREATE A DOCUMENT
		else if (req.method === "POST") {
			try {
				const result = await prisma.document.create({
					data: {
						type: docType,
						content: { ...docContent.content },
						author: {
							connect: {
								id: session.user?.id as string,
							},
						},
					},
				});
				res.status(200).json(result);
			} catch (error) {
				res.status(500).send({ message: "Failed to Get Document" });
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
