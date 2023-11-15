// NEXT REACT
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { SyntheticEvent, useState } from "react";
// DEPENDENCY (PACKAGES, LIBS, INTERFACES, TYPES)
import { getSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import Swal from "sweetalert2";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
	IDocumentData,
	IDisposisiContent,
	IUserData,
} from "@/interfaces/interfaces";
import prisma from "@/libs/prisma";
// COMPONENTS
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";

const fetcher = async (url: string) =>
	await axios.get(url).then((res) => res.data);

export const getServerSideProps: GetServerSideProps = async ({
	req,
	params,
}) => {
	const session = await getSession({ req });
	const result = await prisma.document.findUnique({
		where: {
			id: params?.id as string,
		},
		select: {
			recipients: {
				select: {
					createdAt: true,
					recipientId: true,
					recipient: {
						select: {
							id: true,
							email: true,
							isActive: true,
							name: true,
							position: true,
							role: true,
						},
					},
				},
			},
			id: true,
			content: true,
			type: true,
			createdAt: true,
			author: true,
			authorId: true,
			isSent: true,
			isApproved: true,
		},
	});
	const recipients = await prisma.user.findMany({
		where: {
			email: {
				not: session?.user?.email,
			},
		},
	});
	return {
		props: {
			recipients,
			session,
			params,
			result: JSON.parse(JSON.stringify(result)),
		},
	};
};

export default function Edit({ session, params }: any) {
	const router = useRouter();
	const {
		data: docData,
		error: docIsError,
		isLoading: docIsLoading,
	}: { data: IDocumentData; error: any; isLoading: boolean } = useSWR(
		session ? `/api/documents/${params?.id}` : null,
		fetcher,
		{
			refreshInterval: 1000,
		}
	);
	console.log(docData);

	const {
		data: recipientsData,
		error: recipientsIsLoading,
		isLoading: recipientsIsError,
	}: { data: IUserData[]; error: any; isLoading: boolean } = useSWR(
		session ? `/api/auth/users` : null,
		fetcher,
		{
			refreshInterval: 1000,
		}
	);

	const [recipient, setRecipient] = useState("");
	const [recipientId, setRecipientId] = useState("");
	const [recipientName, setRecipientName] = useState("");
	const [updateDocData, setUpdateDocData] = useState<IDocumentData | undefined>(
		{}
	);

	if (docIsLoading || recipientsIsLoading) {
		return <Loading />;
	} else if (docIsError || recipientsIsError) {
		alert(docIsError);
	}

	// FUNCTIONS

	const handleUpdate = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			await Swal.fire({
				title: "Perbarui Disposisi?",
				icon: "question",
				showCancelButton: true,
				color: "#111827",
				confirmButtonColor: "#60a5fa",
				cancelButtonColor: "#f87171",
				confirmButtonText: "Ya",
				cancelButtonText: "Batal",
			}).then((res) => {
				if (res.isConfirmed) {
					axios.put(
						`/api/documents/${docData?.id}`,
						{
							content: updateDocData?.content,
						},
						{
							headers: { "Content-Type": "application/json" },
						}
					);
					Swal.fire({
						title: "Berhasil diperbarui!",
						icon: "success",
						color: "#111827",
						confirmButtonColor: "#60a5fa",
					}).then(() => {
						router.replace(router.asPath);
					});
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleUploadImage = async (esignURL: string) => {
		await axios.post(
			`/api/esignature`,
			{
				docId: docData.id,
				docSign: esignURL,
			},
			{
				headers: { "Content-Type": "application/json" },
			}
		);
	};

	const handleSend = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			await Swal.fire({
				title: `Kirim ke ${recipientName}?`,
				icon: "question",
				showCancelButton: true,
				color: "#111827",
				confirmButtonColor: "#60a5fa",
				cancelButtonColor: "#f87171",
				confirmButtonText: "Ya",
				cancelButtonText: "Batal",
			}).then((result) => {
				if (result.isConfirmed) {
					axios.post(
						`/api/documents/sent`,
						{
							recipientId,
							documentId: docData?.id,
						},
						{
							headers: { "Content-Type": "application/json" },
						}
					);
					Swal.fire({
						title: "Berhasil terkirim!",
						icon: "success",
						color: "#111827",
						confirmButtonColor: "#60a5fa",
					}).then(() => {
						setRecipient("");
						setRecipientId("");
						setRecipientName("");
						router.replace(router.asPath);
					});
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleUnsend = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			await Swal.fire({
				title: "Tarik Disposisi?",
				icon: "warning",
				showCancelButton: true,
				color: "#111827",
				confirmButtonColor: "#60a5fa",
				cancelButtonColor: "#f87171",
				confirmButtonText: "Ya",
				cancelButtonText: "Batal",
			}).then((result) => {
				if (result.isConfirmed) {
					axios.delete(`/api/documents/sent/${params.id}`);
					Swal.fire({
						title: "Berhasil ditarik!",
						icon: "success",
						color: "#111827",
						confirmButtonColor: "#60a5fa",
					}).then(() => {
						router.replace(router.asPath);
					});
				}
			});
		} catch (error) {
			console.error(error);
		}
	};

	async function handleCancelUpdate(): Promise<void> {
		await Swal.fire({
			title: "Batal Edit?",
			icon: "warning",
			showCancelButton: true,
			color: "#111827",
			confirmButtonColor: "#60a5fa",
			cancelButtonColor: "#f87171",
			confirmButtonText: "Ya",
			cancelButtonText: "Lanjut Edit",
		}).then((res) => {
			if (res.isConfirmed) {
				router.push("/surat/disposisi");
			}
		});
	}

	return (
		<>
			<Head>
				<title>GEMADISPOSISI - Edit Disposisi</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<h1 className="my-4 text-4xl font-semibold">
					Edit Disposisi - {docData?.content?.nomor}
				</h1>
				<form
					onSubmit={handleUpdate}
					className="flex flex-col gap-4 w-full p-6 rounded-xl shadow-xl"
				>
					{/* NOMOR */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Nomor <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.nomor}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-300 text-gray-500 px-4 py-2 rounded-md"
							disabled
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										nomor: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* TANGGAL */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Tanggal <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="date"
							placeholder="..."
							defaultValue={docData?.content?.tanggal}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										tanggal: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* INDEKS */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Indeks <span className="text-red-400">*</span>
						</label>
						<select
							required
							defaultValue={docData?.content?.indeks}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										indeks: e.target.value,
									},
								})
							}
						>
							<option value="">--</option>
							<option value="RAHASIA">RAHASIA</option>
							<option value="PENTING">PENTING</option>
							<option value="BIASA_RUTIN">BIASA/RUTIN</option>
						</select>
					</div>
					{/* SURAT DARI */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Surat Dari <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.suratDari}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										suratDari: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* NOMOR SURAT */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Nomor Surat <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.nomorSurat}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										nomorSurat: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* TANGGAL SURAT */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Tanggal Surat <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="date"
							placeholder="..."
							defaultValue={docData?.content?.tanggalSurat}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										tanggalSurat: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* PERIHAL */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Perihal <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.perihal}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										perihal: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* TANGGAL DITERIMA */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Tanggal Diterima <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="date"
							placeholder="..."
							defaultValue={docData?.content?.tanggalDiterima}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										tanggalDiterima: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* DITERIMA MELAUI */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Diterima Melalui <span className="text-red-400">*</span>
						</label>
						<select
							required
							defaultValue={docData?.content?.diterimaMelalui}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										diterimaMelalui: e.target.value,
									},
								})
							}
						>
							<option value="">--</option>
							<option value="EMAIL_WA">EMAIL/WA</option>
							<option value="POS_EKSPEDISI">POS/EKSPEDISI</option>
							<option value="LANGSUNG">LANGSUNG</option>
						</select>
					</div>
					{/* DITERUSKAN KEPADA */}
					<div className="flex gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 h-fit font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Diteruskan Kepada <span className="text-red-400">*</span>
						</label>
						<div className="flex flex-col md:flex-row gap-2 w-2/3 sm:w-3/4 bg-gray-200 px-4 py-2 rounded-md">
							<div className="flex flex-col gap-2 w-1/2">
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={docData?.content?.diteruskanKepada?.direksi}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														direksi:
															!docData?.content?.diteruskanKepada?.direksi,
													},
												},
											})
										}
									/>
									<p>Direksi</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada
												?.manajemenRepresentative
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														manajemenRepresentative:
															!docData?.content?.diteruskanKepada
																?.manajemenRepresentative,
													},
												},
											})
										}
									/>
									<p>Manajemen Representative</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.auditorInternal
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														auditorInternal:
															!docData?.content?.diteruskanKepada
																?.auditorInternal,
													},
												},
											})
										}
									/>
									<p>Auditor Internal</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.manajerSertifikasi
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														manajerSertifikasi:
															!docData?.content?.diteruskanKepada
																?.manajerSertifikasi,
													},
												},
											})
										}
									/>
									<p>Manajer Sertifikasi</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.penanggungJawabTeknik
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														penanggungJawabTeknik:
															!docData?.content?.diteruskanKepada
																?.penanggungJawabTeknik,
													},
												},
											})
										}
									/>
									<p>Penanggung Jawab Teknik (PJT)</p>
								</div>
							</div>
							<div className="flex flex-col gap-2 w-1/2">
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.koordinatorPJT
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														koordinatorPJT:
															!docData?.content?.diteruskanKepada
																?.koordinatorPJT,
													},
												},
											})
										}
									/>
									<p>Koordinator PJT</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.tenagaTeknik
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														tenagaTeknik:
															!docData?.content?.diteruskanKepada?.tenagaTeknik,
													},
												},
											})
										}
									/>
									<p>Tenaga Teknik (TT/Asesor)</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.administratorUji
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														administratorUji:
															!docData?.content?.diteruskanKepada
																?.administratorUji,
													},
												},
											})
										}
									/>
									<p>Administrator Uji</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.staffAdministrasi
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														staffAdministrasi:
															!docData?.content?.diteruskanKepada
																?.staffAdministrasi,
													},
												},
											})
										}
									/>
									<p>Staff Administrasi</p>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										defaultChecked={
											docData?.content?.diteruskanKepada?.staffKeuangan
										}
										className="w-5 h-5 accent-slate-800 rounded"
										onChange={(e) =>
											setUpdateDocData({
												...docData,
												content: {
													...docData?.content,
													diteruskanKepada: {
														...docData?.content?.diteruskanKepada,
														staffKeuangan:
															!docData?.content?.diteruskanKepada
																?.auditorInternal,
													},
												},
											})
										}
									/>
									<p>Staff Keuangan</p>
								</div>
							</div>
						</div>
					</div>
					{/* ISI */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 h-fit font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Isi <span className="text-red-400">*</span>
						</label>
						<input
							required
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.isi}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										isi: e.target.value.split(",").map((v, k) => v.trim()),
									},
								})
							}
						/>
					</div>
					{/* DIKEMBALIKAN KEPADA */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Dikembalikan Kepada
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.dikembalikanKepada}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										dikembalikanKepada: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* DIKEMBALIKAN TANGGAL */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Dikembalikan Tanggal
						</label>
						<input
							type="date"
							placeholder="..."
							defaultValue={docData?.content?.dikembalikanTanggal}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										dikembalikanTanggal: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* RESUME */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Resume
						</label>
						<select
							defaultValue={docData?.content?.resume}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										resume: e.target.value,
									},
								})
							}
						>
							<option value="">--</option>
							<option value="SELESAI">SELESAI</option>
							<option value="BELUM_SELESAI">BELUM/TIDAK SELESAI</option>
							<option value="BUTUH_BARU">BUTUH BARU</option>
						</select>
					</div>
					{/* PEMBERI */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Pemberi <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.pemberi}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										pemberi: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* JABATAN PEMBERI */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Jabatan Pemberi <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.jabatanPemberi}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										jabatanPemberi: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* PENERIMA 1 */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Penerima 1 <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.penerima1}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										penerima1: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* JABATAN PENERIMA 1 */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Jabatan Penerima 1 <span className="text-red-400">*</span>
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.jabatanPenerima1}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										jabatanPenerima1: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* PENERIMA 2 */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Penerima 2
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.penerima2}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										penerima2: e.target.value,
									},
								})
							}
						/>
					</div>
					{/* JABATAN PENERIMA 2 */}
					<div className="flex items-center gap-6 w-full">
						<label className="w-1/3 sm:w-1/4 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Jabatan Penerima 2
						</label>
						<input
							type="text"
							placeholder="..."
							defaultValue={docData?.content?.jabatanPenerima2}
							className="w-2/3 sm:w-3/4 outline-none bg-gray-200 px-4 py-2 rounded-md"
							onChange={(e) =>
								setUpdateDocData({
									...docData,
									content: {
										...docData?.content,
										jabatanPenerima2: e.target.value,
									},
								})
							}
						/>
					</div>

					<div className="flex items-center gap-6 w-full">
						<label className="w-2/6 sm:w-3/12 font-semibold bg-gray-800 px-4 py-2 rounded-md text-white">
							Tanda Tangan
						</label>
						{docData?.eSign ? (
							<div className="flex justify-center w-1/6 sm:w-5/12 outline-none bg-gray-200 px-4 py-2 rounded-md">
								<img src={docData.eSign} alt="e-sign" width={100} />
							</div>
						) : (
							<></>
						)}

						<UploadButton
							className="w-3/6 sm:w-4/12 outline-none bg-gray-200 px-4 py-2 rounded-md"
							endpoint="imageUploader"
							onClientUploadComplete={(res) => {
								// Do something with the response
								console.log("Files: ", res);
								alert(`Upload Completed, URL = ${res[0].url}`);
								handleUploadImage(res[0].url);
							}}
							onUploadError={(error: Error) => {
								// Do something with the error.
								alert(`ERROR! ${error.message}`);
							}}
						/>
					</div>

					{/* ========== SIMPAN ========== */}
					<div className="flex justify-end gap-2 w-full">
						<div className="flex gap-2 h-fit text-white">
							<button
								type="button"
								className="px-4 py-2 bg-red-400 rounded-md transition-all duration-200 hover:bg-red-600"
								onClick={handleCancelUpdate}
							>
								Batal
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-blue-400 rounded-md transition-all duration-200 hover:bg-blue-600"
							>
								Simpan
							</button>
						</div>
						{/* ========== KIRIM ========== */}
						<div className="flex flex-col gap-2 w-fit p-3 rounded-md bg-gray-200">
							<div className="flex gap-2">
								<select
									className="p-2 rounded-md"
									value={recipient}
									onChange={(e) => {
										setRecipient(e.target.value);
										setRecipientId(e.target.value.split(",")[0]);
										setRecipientName(e.target.value.split(",")[1]);
									}}
								>
									<option value="">--</option>
									{recipientsData?.map((data: any, index: any) => {
										if (data.email !== session.user.email)
											return (
												<option key={index} value={`${data.id},${data.name}`}>
													{data.name}
												</option>
											);
									})}
								</select>
								{!recipientId ? (
									<button
										disabled
										type="button"
										className="flex gap-2 items-center px-4 py-2 bg-amber-200 rounded-md text-white transition-all duration-200"
									>
										<PaperAirplaneIcon className="w-5 h-5" />
										Kirim
									</button>
								) : (
									<button
										type="button"
										onClick={handleSend}
										className="flex gap-2 items-center px-4 py-2 bg-amber-400 rounded-md text-white transition-all duration-200 hover:bg-amber-600"
									>
										<PaperAirplaneIcon className="w-5 h-5" />
										Kirim
									</button>
								)}

								{docData?.recipients?.length !== 0 && (
									<button
										type="button"
										className="px-4 py-2 bg-red-400 rounded-md text-white transition-all duration-200 hover:bg-red-600"
										onClick={handleUnsend}
									>
										Tarik
									</button>
								)}
							</div>
							{docData.isSent ? (
								docData?.recipients?.length !== 0 && (
									<>
										<div>
											<h2 className="font-semibold">Terkirim Ke:</h2>
											<ul>
												{docData?.recipients?.map((data: any, index: any) => {
													return (
														<li key={index}>{`${index + 1}. ${
															data.recipient.name
														}`}</li>
													);
												})}
											</ul>
										</div>
									</>
								)
							) : (
								<></>
							)}
						</div>
					</div>
				</form>
			</Layout>
		</>
	);
}
