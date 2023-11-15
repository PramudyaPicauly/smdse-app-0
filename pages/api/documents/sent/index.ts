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
								isSent: true,
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
						id: true,
						content: true,
						type: true,
						author: true,
						authorId: true,
						recipients: {
							include: {
								recipient: true,
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				});
				res.status(200).json(getDoc);
			} catch (error) {
				res.status(500).send({ message: "Failed to Get Document" });
			}
		}
		// SEND A DOCUMENT
		else if (req.method === "POST") {
			const { recipientId, documentId } = req.body;
			try {
				const docSent = await prisma.document.update({
					where: {
						id: documentId,
					},
					data: {
						isSent: true,
					},
				});
				const sendDoc = await prisma.userOnDocument.create({
					data: {
						recipientId,
						documentId,
					},
				});

				res.status(200).json(sendDoc);
			} catch (error) {
				res.status(500).send({ message: "Failed to Send Document" });
			}
		}
		// UNSEND A DOCUMENT
		// else if (req.method === "DELETE") {
		// 	const { documentId } = req.body;
		// 	try {
		// 		const unsendDoc = await prisma.userOnDocument.deleteMany({
		// 			where: {
		// 				documentId,
		// 			},
		// 		});
		// 		const docUnsent = await prisma.document.update({
		// 			where: {
		// 				id: documentId,
		// 			},
		// 			data: {
		// 				isSent: false,
		// 			},
		// 		});

		// 		res.status(200).json(docUnsent);
		// 	} catch (error) {
		// 		res.status(500).send({ message: "Failed to Unsend Document" });
		// 	}
		// }
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
