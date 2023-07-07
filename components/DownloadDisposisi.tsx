import { saveAs } from "file-saver";
import createReport from "docx-templates";
import axios from "axios";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FolderArrowDownIcon } from "@heroicons/react/24/outline";

export default function DownloadDisposisi(props: any) {
	const { data: session } = useSession();
	const router = useRouter();

	const fetcher = async (url: string) =>
		await axios.get(url).then((res) => res.data);

	const {
		data: resourceData,
		error: resourceError,
		isLoading: resourceIsLoading,
	} = useSWR(session ? `/api/resources` : null, fetcher);

	if (resourceIsLoading) return null;
	if (resourceError) alert(resourceError);
	// if (data || resourceData) return;

	const handleDownload = async (e: any, disposisiData: any) => {
		e.preventDefault();

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
		try {
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
			const blob = new Blob([buffer]);
			saveAs(blob, `${disposisiData.content.nomor}.docx`);
			await router.replace(router.asPath);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div
			className="flex items-center gap-1 w-fit px-2 py-1 rounded-md bg-blue-400 text-slate-800 transition-colors duration-200 hover:text-white hover:bg-blue-600 cursor-pointer"
			onClick={(e) => handleDownload(e, props.data)}
		>
			<FolderArrowDownIcon className="w-5" />
			<p className="hidden md:inline-flex">Unduh</p>
		</div>
	);
}
