// NEXT REACT
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// DEPENDENCY (PACKAGES, LIBS, INTERFACES, TYPES)
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import {
	CheckIcon,
	EyeIcon,
	MagnifyingGlassIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	ArrowDownCircleIcon,
	ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
// COMPONENTS
import Layout from "@/components/Layout";
import DownloadDisposisi from "@/components/DownloadDisposisi";
import Loading from "@/components/Loading";
// FETCHER
const fetcher = async (url: string) =>
	await axios.get(url).then((res) => res.data);
const receivedURL = "/api/documents/received";
const historyURL = "/api/documents/history";

export default function SuratDiterima() {
	const [showHistory, setShowHistory] = useState(false);
	const [searchData, setSearchData] = useState([]);
	const [isSearching, setIsSearching] = useState(false);

	// DEPENDENCIES FUNCTIONS
	const router = useRouter();
	const { data: session } = useSession();
	// FETCH DATA
	const { data, error, isLoading } = useSWR(
		session ? receivedURL : null,
		fetcher,
		{ refreshInterval: 1000 }
	);
	const {
		data: historyData,
		error: historyError,
		isLoading: historyLoading,
	} = useSWR(session ? historyURL : null, fetcher, {
		refreshInterval: 1000,
	});
	if (isLoading) return <Loading />;
	if (error) alert(error);

	async function handleSearch(e: any) {
		const results: any = historyData.filter((d: any) => {
			if (e.target.value === "") return d;
			return d.content.nomor
				.toLowerCase()
				.includes(e.target.value.toLowerCase());
		});
		setSearchData(results);
	}

	console.log(searchData);

	return (
		<>
			<Head>
				<title>GEMADISPOSISI - Surat Diterima</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<h1 className="my-4 text-4xl font-semibold text-gray-800">
					Surat Diterima
				</h1>
				<div className="overflow-hidden rounded-lg">
					<table className="w-full border-collapse bg-gray-600 text-left text-sm text-white">
						<thead className="bg-gray-800">
							<tr>
								<th scope="col" className="px-6 py-4 font-medium">
									Surat
								</th>
								<th scope="col" className="px-6 py-4 font-medium">
									Judul/Nomor
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium dden md:table-cell"
								>
									Tanggal
								</th>
								<th
									scope="col"
									className="px-6 py-4 font-medium hidden md:table-cell"
								>
									Perihal
								</th>
								<th scope="col" className="px-6 py-4 font-medium">
									Dibaca
								</th>
								<th scope="col" className="px-6 py-4 font-medium">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{data?.length === 0 ? (
								<>
									<tr>
										<td colSpan={6} className="px-6 py-4 text-center">
											<p>Belum ada surat diterima.</p>
										</td>
									</tr>
								</>
							) : (
								data?.map((data: any, index: any) => {
									return (
										<tr className="hover:bg-gray-700" key={index}>
											<td className="px-6 py-4">{data?.type}</td>
											<td className="px-6 py-4">{data?.content.nomor}</td>
											<td className="px-6 py-4 hidden md:table-cell">
												{data?.content.tanggal}
											</td>

											<td className="px-6 py-4 hidden md:table-cell">
												{data?.content.perihal}
											</td>
											<td className="px-6 py-4 hidden md:table-cell">
												{data?.recipients.find(
													(e) => e.recipientId === session?.user.id
												).isRead ? (
													<CheckIcon className="w-6 p-1 bg-green-600 rounded-full" />
												) : (
													<XMarkIcon className="w-6 p-1 bg-amber-600 rounded-full" />
												)}
											</td>
											<td className="flex gap-2 px-6 py-4">
												<div
													onClick={() =>
														router.push({
															pathname: "/surat/disposisi/view/[id]",
															query: { id: data?.id },
														})
													}
													className="flex items-center gap-1 w-fit px-2 py-1 rounded-md bg-amber-400 text-slate-800 transition-colors duration-200 hover:bg-amber-600 cursor-pointer"
												>
													<EyeIcon className="w-5" />
													<p>Lihat</p>
												</div>
												<DownloadDisposisi data={data} />
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
				<div className="flex gap-3 items-center">
					<div
						onClick={() => setShowHistory(!showHistory)}
						className="flex justify-center items-center gap-2 w-fit my-4 px-3 py-2 rounded-lg text-lg text-white bg-gray-800 cursor-pointer"
					>
						<p>Riwayat Surat</p>
						{showHistory ? (
							<ArrowUpCircleIcon className="w-7" />
						) : (
							<ArrowDownCircleIcon className="w-7" />
						)}
					</div>

					{/* <div>
						<button
							type="button"
							className="flex gap-2 p-3  transition-all duration-150 bg-red-400 hover:bg-red-600 cursor-pointer"
							onClick={() => {
								setIsSearching(false);
								setSearchData([]);
							}}
						>
							<XMarkIcon className="w-6" />
						</button>
						<input
							type="text"
							placeholder="Nomor..."
							className="p-2 rounded-r-md bg-gray-800 outline-none "
							onChange={handleSearch}
						/>
					</div> */}
					<div className="flex items-center bg-gray-800 text-white p-2 rounded-lg">
						<MagnifyingGlassIcon className="w-5" />
						<input
							type="text"
							placeholder="Nomor..."
							className="p-1 rounded-r-md bg-gray-800 outline-none "
							onChange={handleSearch}
						/>
						{searchData.length !== 0 ? (
							<XMarkIcon
								onClick={() => {
									setSearchData([]);
								}}
								className="w-5 h-5 bg-red-600 rounded-full"
							/>
						) : (
							<></>
						)}
					</div>
				</div>
				{showHistory ? (
					<div className="overflow-hidden rounded-lg">
						<table className="w-full border-collapse bg-gray-600 text-left text-sm text-white">
							<thead className="bg-gray-800">
								<tr>
									<th scope="col" className="px-6 py-4 font-medium">
										Surat
									</th>
									<th scope="col" className="px-6 py-4 font-medium">
										Judul/Nomor
									</th>
									<th
										scope="col"
										className="px-6 py-4 font-medium dden md:table-cell"
									>
										Tanggal
									</th>
									<th
										scope="col"
										className="px-6 py-4 font-medium hidden md:table-cell"
									>
										Perihal
									</th>
									<th scope="col" className="px-6 py-4 font-medium">
										Aksi
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{searchData?.length === 0 ? (
									historyData?.length === 0 ? (
										<>
											<tr>
												<td colSpan={5} className="px-6 py-4 text-center">
													<p>Belum ada surat diterima.</p>
												</td>
											</tr>
										</>
									) : (
										historyData?.map((data: any, index: any) => {
											return (
												<tr className="hover:bg-gray-700" key={index}>
													<td className="px-6 py-4">{data?.type}</td>
													<td className="px-6 py-4">{data?.content.nomor}</td>
													<td className="px-6 py-4 hidden md:table-cell">
														{data?.content.tanggal}
													</td>

													<td className="px-6 py-4 hidden md:table-cell">
														{data?.content.perihal}
													</td>
													<td className="flex gap-2 px-6 py-4">
														<div
															onClick={() =>
																router.push({
																	pathname: "/surat/disposisi/view/[id]",
																	query: { id: data?.id },
																})
															}
															className="flex items-center gap-1 w-fit px-2 py-1 rounded-md bg-amber-400 text-slate-800 transition-colors duration-200 hover:bg-amber-600 cursor-pointer"
														>
															<EyeIcon className="w-5" />
															<p>Lihat</p>
														</div>
													</td>
												</tr>
											);
										})
									)
								) : searchData?.length === 0 ? (
									<>
										<tr>
											<td colSpan={5} className="px-6 py-4 text-center">
												<p></p>
											</td>
										</tr>
									</>
								) : (
									searchData?.map((data: any, index: any) => {
										return (
											<tr className="hover:bg-gray-700" key={index}>
												<td className="px-6 py-4">{data?.type}</td>
												<td className="px-6 py-4">{data?.content.nomor}</td>
												<td className="px-6 py-4 hidden md:table-cell">
													{data?.content.tanggal}
												</td>

												<td className="px-6 py-4 hidden md:table-cell">
													{data?.content.perihal}
												</td>
												<td className="flex gap-2 px-6 py-4">
													<div
														onClick={() =>
															router.push({
																pathname: "/surat/disposisi/view/[id]",
																query: { id: data?.id },
															})
														}
														className="flex items-center gap-1 w-fit px-2 py-1 rounded-md bg-amber-400 text-slate-800 transition-colors duration-200 hover:bg-amber-600 cursor-pointer"
													>
														<EyeIcon className="w-5" />
														<p>Lihat</p>
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				) : (
					<></>
				)}
			</Layout>
		</>
	);
}
