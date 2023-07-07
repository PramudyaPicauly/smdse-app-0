import prisma from "@/libs/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);

	const id = req.query.id as string;

	if (session) {
		if (req.method === "GET") {
			const result = await prisma.document.findUnique({
				where: {
					id: id,
				},
			});
			res.status(200).json(result);
		} else if (req.method === "PUT") {
			try {
				const result = await prisma.document.update({
					where: {
						id: id,
					},
					data: {
						isSent: true,
					},
				});
				const result2 = await prisma.userOnDocument.create({
					data: {
						userId: session?.user?.id,
						documentId: id,
					},
				});
				res.status(200).json(result2);
			} catch (error) {
				res.status(401).send({ message: "Failed to PUT" });
			}
		} else if (req.method === "DELETE") {
			try {
				const deleteDocument = await prisma.document.delete({
					where: {
						id: paramString,
					},
				});
				res.json(deleteDocument);
			} catch (error) {
				res.status(401).send({ message: "Failed to DELETE" });
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
