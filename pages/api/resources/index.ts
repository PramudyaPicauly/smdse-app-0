import fs from "fs";

// NEXT
import type { NextApiRequest, NextApiResponse } from "next";

// DEPENDENCY
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	if (session) {
		if (req.method === "GET") {
			const disposisiTemplate = fs.readFileSync("docs/disposisi-temp.docx");
			const redBoxBase64 = fs.readFileSync("docs/redbox.PNG", "base64");
			const whiteBoxBase64 = fs.readFileSync("docs/whitebox.PNG", "base64");
			res.json({
				template: {
					disposisi: disposisiTemplate,
				},
				img: {
					redbox: "data:image/png;base64," + redBoxBase64,
					whitebox: "data:image/png;base64," + whiteBoxBase64,
				},
			});
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
