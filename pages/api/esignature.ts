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
	const { docId, docSign } = req.body;

	if (req.method === "POST") {
		const result = await prisma.document.update({
			where: {
				id: docId,
			},
			data: {
				eSign: docSign,
			},
		});

		res.status(200).json(result);
	}
}
