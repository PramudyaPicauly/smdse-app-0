let docxConverter = require("docx-pdf");
let libre = require("libreoffice-convert");
let path = require("path");
let docx = require("@nativedocuments/docx-wasm");
import fs from "fs";

// NEXT
import type { NextApiRequest, NextApiResponse } from "next";

// DEPENDENCY
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import createReport from "docx-templates";

libre.convertAsync = require("util").promisify(libre.convert);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const session = await getServerSession(req, res, authOptions);
	const { title, disposisiData, resourceData } = req.body;
	if (session) {
		if (req.method === "POST") {
			const fileTitle = title.replaceAll("/", "_");

			const redBoxImg = async () => {
				const strToDataURL: any = resourceData.img.redbox;
				const data = strToDataURL.slice("data:image/png;base64,".length);
				return { width: 0.5334, height: 0.4572, data, extension: ".png" };
			};
			const whiteBoxImg = async () => {
				const strToDataURL: any = resourceData.img.whitebox;
				const data = strToDataURL.slice("data:image/png;base64,".length);
				return { width: 0.5334, height: 0.4572, data, extension: ".png" };
			};
			const buffer = await createReport({
				template: Buffer.from(resourceData.template.disposisi),
				data: {
					...disposisiData,
				},
				cmdDelimiter: ["{", "}"],
				additionalJsContext: {
					indeksRahasia: () => {
						if (disposisiData.content.indeks === "RAHASIA") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					indeksPenting: () => {
						if (disposisiData.content.indeks === "PENTING") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					indeksBiasa: () => {
						if (disposisiData.content.indeks === "BIASA_RUTIN") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					emailWa: () => {
						if (disposisiData.content.diterimaMelalui === "EMAIL_WA") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					posEkspedisi: () => {
						if (disposisiData.content.diterimaMelalui === "POS_EKSPEDISI") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					langsung: () => {
						if (disposisiData.content.diterimaMelalui === "LANGSUNG") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					direksi: () => {
						if (disposisiData.content.diteruskanKepada.direksi) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					manajemenRepresentative: () => {
						if (
							disposisiData.content.diteruskanKepada.manajemenRepresentative
						) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					auditorInternal: () => {
						if (disposisiData.content.diteruskanKepada.auditorInternal) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					manajerSertifikasi: () => {
						if (disposisiData.content.diteruskanKepada.manajerSertifikasi) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					penanggungJawabTeknik: () => {
						if (disposisiData.content.diteruskanKepada.penanggungJawabTeknik) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					koordinatorPJT: () => {
						if (disposisiData.content.diteruskanKepada.koordinatorPJT) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					tenagaTeknik: () => {
						if (disposisiData.content.diteruskanKepada.tenagaTeknik) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					administratorUji: () => {
						if (disposisiData.content.diteruskanKepada.administratorUji) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					staffAdministrasi: () => {
						if (disposisiData.content.diteruskanKepada.staffAdministrasi) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					staffKeuangan: () => {
						if (disposisiData.content.diteruskanKepada.direksi) {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					resumeSelesai: () => {
						if (disposisiData.content.resume === "SELESAI") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					resumeBelumSelesai: () => {
						if (disposisiData.content.resume === "BELUM_SELESAI") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
					resumeButuhBaru: () => {
						if (disposisiData.content.resume === "BUTUH_BARU") {
							return redBoxImg();
						} else {
							return whiteBoxImg();
						}
					},
				},
			});
			// console.log(buffer);

			fs.writeFileSync(`docs/${fileTitle}`, buffer);

			// setTimeout(async () => {
			// 	await docxConverter(
			// 		`./docs/006.LD_PDKB_2023.docx`,
			// 		`./docs/006.LD_PDKB_2023.pdf`,
			// 		function (err, result) {
			// 			if (err) {
			// 				console.log(err);
			// 			} else console.log(result);
			// 		}
			// 	);
			// }, 3);

			// init docx engine
			// docx
			// 	.init({
			// 		// ND_DEV_ID: "XXXXXXXXXXXXXXXXXXXXXXXXXX",    // goto https://developers.nativedocuments.com/ to get a dev-id/dev-secret
			// 		// ND_DEV_SECRET: "YYYYYYYYYYYYYYYYYYYYYYYYYY", // you can also set the credentials in the enviroment variables
			// 		ENVIRONMENT: "NODE", // required
			// 		LAZY_INIT: true, // if set to false the WASM engine will be initialized right now, usefull pre-caching (like e.g. for AWS lambda)
			// 	})
			// 	.catch(function (e) {
			// 		console.error(e);
			// 	});

			// const convertHelper = async (document, exportFct) => {
			// 	const api = await docx.engine();
			// 	await api.load(document);
			// 	const arrayBuffer = await api[exportFct]();
			// 	await api.close();
			// 	return arrayBuffer;
			// };

			// convertHelper("./docs/disposisi-temp.docx", "exportPDF")
			// 	.then((arrayBuffer) => {
			// 		fs.writeFileSync("sample.pdf", new Uint8Array(arrayBuffer));
			// 	})
			// 	.catch((e) => {
			// 		console.error(e);
			// 	});

			// const path = require("path");
			// const unoconv = require("awesome-unoconv");

			// const sourceFilePath = path.resolve(
			// 	"./docs/surat-pernyataan-dosen-pembimbing-2.docx"
			// );
			// const outputFilePath = path.resolve(
			// 	"./docs/surat-pernyataan-dosen-pembimbing-2.pdf"
			// );

			// unoconv
			// 	.convert(sourceFilePath, outputFilePath)
			// 	.then((result) => {
			// 		console.log(result); // return outputFilePath
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	});
		}
	} else {
		res.status(401).json({ message: "Unauthorized" });
	}
}
