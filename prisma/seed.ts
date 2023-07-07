import prisma from "@/libs/prisma";
async function main() {
	const recordOne = await prisma.document.create({
		data: {
			content: {
				nomor: "001.LD/GPDKB/2023",
				tanggal: "01-01-2023",
				indeks: "RAHASIA",
				suratDari: "MR",
				nomorSurat: "001",
				tanggalSurat: "01-01-2023",
				perihal: "Perihal",
				tanggalDiterima: "01-01-2023",
				diterimaMelalui: "LANGSUNG",
				diteruskanKepada: {
					direksi: false,
					manajemenRepresentative: false,
					auditorInternal: false,
					manajerSertifikasi: false,
					penanggungJawabTeknik: false,
					koordinatorPJT: false,
					tenagaTeknik: false,
					administratorUji: false,
					staffAdministrasi: false,
					staffKeuangan: true,
				},
				isi: [],
				dikembalikanKepada: "",
				dikembalikanTanggal: "",
				resume: "",
				pemberi: "Pemberi",
				penerima1: "Penerima",
				penerima2: "",
				jabatanPemberi: "Jabatan Pemberi",
				jabatanPenerima1: "Jabatan Penerima",
				jabatanPenerima2: "",
			},
		},
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
