import prisma from "@/libs/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	const id = req.query.id as string;

	if (session) {
		// ========== GET USER BY ID ==========
		if (req.method === "GET") {
			try {
				const result = await prisma.user.findUnique({
					where: {
						id: id as string,
					},
					select: {
						id: true,
						email: true,
						isActive: true,
						name: true,
						position: true,
						role: true,
					},
				});
				res.status(200).json(result);
			} catch (error) {
				res.status(500).send({ message: "Failed to Get User" });
			}
		}
		// ========== UPDATE USER BY ID ==========
		else if (req.method === "PUT") {
			const { email, name, position, role, isActive } = req.body;
			try {
				const user = await prisma.user.findUnique({
					where: {
						id,
					},
				});
				const updateUser = await prisma.user.update({
					where: {
						id,
					},
					data: {
						email: email ? email : user?.email,
						name: name ? name : user?.name,
						position: position ? position : user?.position,
						role: role ? role : user?.role,
						isActive: isActive ? isActive : user?.isActive,
					},
				});
				res.status(200).json(updateUser);
			} catch (error) {
				res.status(500).send({ message: "Failed to Update User" });
			}
		}
		// ========== DELETE USER BY ID ==========
		else if (req.method === "DELETE") {
			try {
				const result = await prisma.user.delete({
					where: {
						id,
					},
				});
				res.status(200).json(result);
			} catch (error) {
				res.status(500).send({ message: "Failed to Delete User" });
			}
		}
	} else {
		res.status(401).json({ message: "Unauthorized!" });
	}
}
