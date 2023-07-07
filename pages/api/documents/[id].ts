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
	const id = req.query.id as string;

	if (session) {
		// ========== GET DOCUMENT BY ID ==========
		if (req.method === "GET") {
			try {
				const getDoc = await prisma.document.findUnique({
					where: {
						id,
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
				});
				res.status(200).json(getDoc);
			} catch (error) {
				res.status(500).send({ message: "Failed to Get Document" });
			}
		}
		// ========== UPDATE DOCUMENT BY ID ==========
		else if (req.method === "PUT") {
			const { type, content, isSent, isApproved } = req.body;
			try {
				const doc = await prisma.document.findUnique({
					where: {
						id: id,
					},
				});
				const updateDoc = await prisma.document.update({
					where: {
						id: id,
					},
					data: {
						type: type ? type : doc?.type,
						content: content ? content : doc?.content,
						isSent: isSent ? isSent : doc?.isSent,
						isApproved: isApproved ? isApproved : doc?.isApproved,
					},
				});
				res.status(200).json(updateDoc);
			} catch (error) {
				res.status(500).send({ message: "Failed to Update Document" });
			}
		}
		// ========== DELETE DOCUMENT BY ID ==========
		else if (req.method === "DELETE") {
			try {
				const deleteDoc = await prisma.document.delete({
					where: {
						id: id,
					},
				});
				res.json(deleteDoc);
			} catch (error) {
				res.status(500).send({ message: "Failed to Delete Document" });
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
