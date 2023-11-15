import React, { forwardRef, useState } from "react";
type TIndeks = "RAHASIA" | "PENTING" | "BIASA_RUTIN" | undefined;

export const HtmlTemplate = forwardRef((props, ref) => {
	const [indeksState, setIndeksState] = useState<TIndeks>(undefined);

	return (
		<div
			ref={ref}
			className="pt-[0.4in] pl-[0.57in] calibri-font text-[10pt] w-[8.5in] h-[11in] text-black bg-white"
		>
			<div className="flex flex-col divide-y divide-[#000000] w-[7.48in] h-[9.7in] border-[0.5pt] border-black">
				{/* ==================== LEMBAR DSPOSISI ==================== */}
				<div className="h-[0.75in] font-bold">
					<p className="text-center leading-none mt-[2pt]">LEMBAR DISPOSISI</p>
					<p className="text-center leading-none mt-[2pt]">
						Nomor : {`${props?.data?.content?.nomor}`}
					</p>
					<p className="text-center leading-none mt-[2pt]">
						Tanggal : {`${props?.data?.content?.tanggal}`}
					</p>
				</div>
				{/* ==================== INDEKS ==================== */}
				<div className="h-[0.32in] flex divide-x divide-[#000000] font-bold">
					<div className="flex items-center w-[1.88in] h-[0.32in] pl-[0.08in] leading-none">
						Indeks
					</div>
					<div className="flex items-center w-[0.31in] h-[0.32in] pl-[0.08in] leading-none">
						:
					</div>
					<div className="flex gap-2 items-center w-[1.76in] h-[0.32in] pl-[0.08in] leading-none">
						<div
							className={`w-[0.23in] h-[0.18in] border-[0.5pt] border-black ${
								props?.data?.content?.indeks === "RAHASIA"
									? "bg-red-600"
									: "bg-white"
							}`}
						></div>
						<p>Rahasia</p>
					</div>
					<div className="flex gap-2 items-center w-[1.76in] h-[0.32in] pl-[0.08in] leading-none">
						<div
							className={`w-[0.23in] h-[0.18in] border-[0.5pt] border-black ${
								props?.data?.content?.indeks === "PENTING"
									? "bg-red-600"
									: "bg-white"
							}`}
						></div>
						<p>Penting</p>
					</div>
					<div className="flex gap-2 items-center w-[1.77in] h-[0.32in] pl-[0.08in] leading-none">
						<div
							className={`w-[0.23in] h-[0.18in] border-[0.5pt] border-black ${
								props?.data?.content?.indeks === "BIASA_RUTIN"
									? "bg-red-600"
									: "bg-white"
							}`}
						></div>
						<p>Biasa/Rutin</p>
					</div>
				</div>
				{/* ==================== SEPARATOR ==================== */}
				<div className="h-[0.14in]"></div>
				{/* ==================== SURAT DARI ==================== */}
				<div className="h-[0.28in] flex divide-x divide-[#000000]">
					<div className="flex items-center w-[1.88in] h-[0.28in] pl-[0.08in] leading-none">
						Surat dari / Instruksi dari
					</div>
					<div className="flex items-center w-[0.31in] h-[0.28in] pl-[0.08in] leading-none">
						:
					</div>
					<div className="flex items-center w-[5.29in] h-[0.28in] pl-[0.08in] leading-none">
						{`${props?.data?.content?.suratDari}`}
					</div>
				</div>
				{/* ==================== NOMOR SURAT ==================== */}
				<div className="h-[0.28in] flex divide-x divide-[#000000]">
					<div className="flex items-center w-[1.88in] h-[0.28in] pl-[0.08in] leading-none">
						Nomor Surat
					</div>
					<div className="flex items-center w-[0.31in] h-[0.28in] pl-[0.08in] leading-none">
						:
					</div>
					<div className="flex items-center w-[5.29in] h-[0.28in] pl-[0.08in] leading-none">
						{`${props?.data?.content?.nomorSurat}`}
					</div>
				</div>
				{/* ==================== TANGGAL SURAT ==================== */}
				<div className="h-[0.28in] flex divide-x divide-[#000000]">
					<div className="flex items-center w-[1.88in] h-[0.28in] pl-[0.08in] leading-none">
						Tgl. Surat / Tgl.Instruksi
					</div>
					<div className="flex items-center w-[0.31in] h-[0.28in] pl-[0.08in] leading-none">
						:
					</div>
					<div className="flex items-center w-[5.29in] h-[0.28in] pl-[0.08in] leading-none">
						{`${props?.data?.content?.tanggalSurat}`}
					</div>
				</div>
				{/* ==================== PERIHAL ==================== */}
				<div className="h-[0.47in] flex items-center divide-x divide-[#000000] font-bold bg-[#C6D9F1]">
					<div className="w-[7.48in] pl-[0.08in]">
						Perihal : {`${props?.data?.content?.perihal}`}
					</div>
				</div>
				{/* ==================== TANGGAL DITERIMA ==================== */}
				<div className="h-[0.96in] flex divide-x divide-[#000000]">
					<div className="w-[1.88in] h-[0.96in] pl-[0.08in] flex items-center">
						Tanggal Diterima
					</div>
					<div className="w-[0.31in] h-[0.96in] pl-[0.08in] flex items-center">
						:
					</div>
					<div className="w-[1.88in] h-[0.96in] pl-[0.08in] flex items-center">
						{`${props?.data?.content?.tanggalDiterima}`}
					</div>
					<div className="w-[1.25in] h-[0.96in] pl-[0.08in] flex items-center">
						Diterima Melalui
					</div>
					<div className="w-[2.17in] h-[0.96in] flex flex-col divide-y divide-[#000000]">
						<div className="h-[0.32in] w-[2.17in] pl-[0.08in] flex gap-2 items-center">
							<div
								className={`w-[0.23in] h-[0.18in] border-[0.5pt] border-black ${
									props?.data?.content?.diterimaMelalui === "EMAIL_WA"
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p>Email/WA</p>
						</div>
						<div className="h-[0.32in] w-[2.17in] pl-[0.08in] flex gap-2 items-center">
							<div
								className={`w-[0.23in] h-[0.18in] border-[0.5pt] border-black ${
									props?.data?.content?.diterimaMelalui === "POS_EKSPEDISI"
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p>Pos/Ekspedisi</p>
						</div>
						<div className="h-[0.32in] w-[2.17in] pl-[0.08in] flex gap-2 items-center">
							<div
								className={`w-[0.23in] h-[0.18in] border-[0.5pt] border-black ${
									props?.data?.content?.diterimaMelalui === "LANGSUNG"
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p>Langsung</p>
						</div>
					</div>
				</div>
				{/* ==================== SEPARATOR ==================== */}
				<div className="h-[0.14in]"></div>
				{/* ==================== DITERUSKAN KEPADA ISI HEADING ==================== */}
				<div className="h-[0.34in] flex items-center divide-x divide-[#000000] font-bold bg-[#C6D9F1]">
					<div className="w-[2.68in] h-[0.34in] flex justify-center items-center">
						DITERUSKAN KEPADA
					</div>
					<div className="w-[4.8in] h-[0.34in] flex justify-center items-center">
						ISI DISPOSISI
					</div>
				</div>
				{/* ==================== DITERUSKAN KEPADA ISI CONTENT ==================== */}
				<div className="h-[3.2in] flex items-center divide-x divide-[#000000]">
					<div className="h-[3.2in] w-[2.68in] flex flex-col">
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.direksi
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Direksi</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada
										?.manajemenRepresentative
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Manajemen Representative (MR)</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.auditorInternal
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Auditor Internal</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.manajerSertifikasi
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Manajer Sertifikasi (MS)</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.penanggungJawabTeknik
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Penanggung Jawab Teknik (PJT)</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.koordinatorPJT
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Koordinator PJT</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.tenagaTeknik
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Tenaga Teknik (TT/Asesor)</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.administratorUji
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Administrator Uji</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.staffAdministrasi
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Staff Administrasi</p>
						</div>
						<div className="h-[0.32in] pl-[0.08in] flex items-center gap-2">
							<div
								className={`w-[0.25in] h-[0.2in] border-[0.5pt] border-black ${
									props?.data?.content?.diteruskanKepada?.staffKeuangan
										? "bg-red-600"
										: "bg-white"
								}`}
							></div>
							<p className="w-full">Staff Keuangan</p>
						</div>
					</div>
					<div className="h-[3.2in] w-[4.8in] pl-[0.3in] pt-[0.2in]">
						{props?.data?.content?.isi.map((d, i) => {
							return (
								<div className="flex gap-3">
									<div>{`${i + 1}.`}</div>
									<div className="w-[3.5in]">{`${d}`}</div>
								</div>
							);
						})}
					</div>
				</div>
				{/* ==================== DIKEMBALIKAN KEPADA ==================== */}
				<div className="h-[1.2in] pl-[0.08in] pt-[0.08in] flex flex-col gap-1.5">
					<div>Setelah dilaksanakan harap segera dikembalikan :</div>
					<div className="flex">
						<div className="w-[1.88in]">Dikembalikan Kepada</div>
						<div className="w-[0.31in]">:</div>
						<div>{props?.data?.content?.dikembalikanKepada}</div>
					</div>
					<div className="flex">
						<div className="w-[1.88in]">Dikembalikan Tanggal</div>
						<div className="w-[0.31in]">:</div>
						<div>{props?.data?.content?.dikembalikanTanggal}</div>
					</div>
					<div className="flex">
						<div className="w-[1.88in]">Resume</div>
						<div className="w-[0.31in]">:</div>
						<div className="w-[1.3in] flex gap-2">
							<div className="w-[0.23in] h-[0.18in] border-[0.5pt] border-black"></div>
							<div className="w-full">Selesai</div>
						</div>
						<div className="w-[2in] flex gap-2">
							<div className="w-[0.23in] h-[0.18in] border-[0.5pt] border-black"></div>
							<div className="w-full">Belum/Tidak Selesai</div>
						</div>
						<div className="w-[1.7in] flex gap-2">
							<div className="w-[0.23in] h-[0.18in] border-[0.5pt] border-black"></div>
							<div className="w-full">Butuh Disposisi Baru</div>
						</div>
					</div>
				</div>
				{/* ==================== TANDA TANGAN ==================== */}
				<div className="h-[1.32in] flex divide-x divide-[#000000]">
					<div className="flex flex-col justify-between w-[2.68in] pl-[0.08in] py-[0.05in]">
						<div>Pemberi Disposisi</div>
						<img
							src={props?.data?.eSign}
							alt="e-sign"
							width={70}
							height={120}
						/>
						<div>
							<div className="underline">
								..................................
							</div>
							<div>{`${props?.data?.content?.pemberi}`}</div>
						</div>
					</div>
					<div className="flex flex-col justify-between w-[4.8in] pl-[0.08in] py-[0.05in]">
						<div>Penerima Disposisi</div>
						<div>
							<div className="underline">
								..................................
							</div>
							<div>{`${props?.data?.content?.penerima1}`}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
