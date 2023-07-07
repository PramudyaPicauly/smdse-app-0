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
	const { docContent, docType, docId } = req.body;
	const session = await getServerSession(req, res, authOptions);

	if (session) {
		if (req.method === "GET") {
			const result = await prisma.document.findMany({
				where: {
					AND: [
						{
							user: {
								id: {
									equals: session.user?.id,
								},
							},
						},
					],
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			res.status(200).json(result);
		} else if (req.method === "POST") {
			try {
				const result = await prisma.document.create({
					data: {
						type: docType,
						content: { ...docContent.content },
						user: {
							connect: {
								id: session.user?.id as string,
							},
						},
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
