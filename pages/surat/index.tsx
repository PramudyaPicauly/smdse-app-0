// NEXT REACT
import Head from "next/head";
import { useRouter } from "next/router";

// DEPENDENCY (PACKAGES, LIBS, INTERFACES, TYPES)
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// COMPONENTS
import Loading from "@/components/Loading";
import Layout from "@/components/Layout";

const documentURL = "/api/documents";
const fetcher = async (url: string) =>
	await axios.get(url).then((res) => res.data);

export default function SuratTerbaru() {
	const router = useRouter();
	const { data: session } = useSession();

	const {
		data: documentData,
		error: documentError,
		isLoading: documentIsLoading,
	} = useSWR(session ? documentURL : null, fetcher, { refreshInterval: 1000 });

	if (documentIsLoading) {
		return <Loading />;
	} else if (documentError) {
		alert(documentError);
	} else {
		console.log(documentData);
	}

	return (
		<>
			<Head>
				<title>GEMADISPOSISI - Surat Terbaru</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<h1 className="my-4 text-4xl font-semibold">Surat Terbaru</h1>
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
								<th scope="col" className="px-6 py-4 font-medium">
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
							{documentData?.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-4 text-center">
										<p>Belum ada surat dibuat.</p>
									</td>
								</tr>
							) : documentData?.length > 3 ? (
								documentData.slice(0, 5).map((d: any, i: any) => {
									return (
										<tr key={i} className="hover:bg-gray-700">
											<td className="px-6 py-4">{d.type}</td>
											<td className="px-6 py-4">{d.content.nomor}</td>
											<td className="px-6 py-4">{d.content.tanggal}</td>
											<td className="px-6 py-4 hidden md:table-cell">
												{d.content.perihal}
											</td>
											<td className="px-6 py-4">
												<div
													onClick={() =>
														router.push({
															pathname: "/surat/disposisi/edit/[id]",
															query: { id: d.id },
														})
													}
													className="flex items-center gap-1 w-fit px-2 py-1 rounded-md bg-amber-400 text-slate-800 cursor-pointer transition-colors duration-200 hover:text-white hover:bg-amber-600"
												>
													<PencilSquareIcon className="w-5" />
													<p className="hidden md:inline-flex">Edit</p>
												</div>
											</td>
										</tr>
									);
								})
							) : (
								documentData?.map((d: any, i: any) => {
									return (
										<tr key={i} className="hover:bg-gray-700">
											<td className="px-6 py-4">{d.type}</td>
											<td className="px-6 py-4">{d.content.nomor}</td>
											<td className="px-6 py-4">{d.content.tanggal}</td>
											<td className="px-6 py-4 hidden md:table-cell">
												{d.content.perihal}
											</td>
											<td className="px-6 py-4">
												<div
													onClick={() =>
														router.push({
															pathname: "/surat/disposisi/edit/[id]",
															query: { id: d.id },
														})
													}
													className="flex items-center gap-1 w-fit px-2 py-1 rounded-md bg-amber-400 text-slate-800 cursor-pointer transition-colors duration-200 hover:text-white hover:bg-amber-600"
												>
													<PencilSquareIcon className="w-5" />
													<p className="hidden md:inline-flex">Edit</p>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</Layout>
		</>
	);
}
