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
	const { recipientId } = req.body;

	if (session) {
		if (req.method === "GET") {
			// GET SPECIFIC SENT FILE
			try {
				const result = await prisma.document.findMany({
					where: {
						id: id,
					},
					include: {
						recipients: {
							include: {
								recipient: true,
							},
						},
					},
				});
				res.status(200).json(result);
			} catch (error) {
				res.status(401).send({ message: "Failed to GET" });
			}
		} else if (req.method === "PUT") {
			// SENT DOC
			try {
				const documentIsSent = await prisma.document.update({
					where: {
						id: id,
					},
					data: {
						isSent: true,
					},
				});
				const createUserOnDocument = await prisma.userOnDocument.create({
					data: {
						recipientId: recipientId,
						documentId: id,
					},
				});
				res.status(200).json(createUserOnDocument);
			} catch (error) {
				res.status(401).send({ message: "Failed to PUT" });
			}
		} else if (req.method === "DELETE") {
			// UNSENT DOC
			try {
				const result = await prisma.userOnDocument.deleteMany({
					where: {
						documentId: id,
					},
				});
				const result2 = await prisma.document.update({
					where: {
						id: id,
					},
					data: {
						isSent: false,
					},
				});
				res.json(result2);
			} catch (error) {
				res.status(401).send({ message: "Failed to DELETE" });
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
