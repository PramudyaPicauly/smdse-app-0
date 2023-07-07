//NEXT REACT
import Link from "next/link";
import { useRouter } from "next/router";

//D
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import useSWR from "swr";
import {
	UserCircleIcon,
	HomeIcon,
	DocumentTextIcon,
	DocumentArrowUpIcon,
	DocumentArrowDownIcon,
	PowerIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
	const { data: session } = useSession();

	const router = useRouter();

	const fetcher = async (url: string) =>
		await axios.get(url).then((res) => res.data);

	const {
		data: sentData,
		error: sentError,
		isLoading: sentIsLoading,
	} = useSWR(session ? `/api/documents/sent` : null, fetcher, {
		refreshInterval: 1000,
	});

	const {
		data: receivedData,
		error: receivedError,
		isLoading: receivedIsLoading,
	} = useSWR(session ? `/api/documents/received` : null, fetcher, {
		refreshInterval: 1000,
	});

	const {
		data: readData,
		error: readError,
		isLoading: readIsLoading,
	} = useSWR(session ? `/api/userondocument` : null, fetcher, {
		refreshInterval: 1000,
	});

	if (sentIsLoading || receivedIsLoading || readIsLoading) {
		return <p>Loading...</p>;
	}

	if (sentError) {
		alert(sentError);
	} else if (receivedError) {
		alert(receivedError);
	} else if (readError) {
		alert(readError);
	}

	const minimizeTab = [
		{ title: "Dashboard", icon: <HomeIcon className="w-6" />, url: "/" },
		{
			title: "Surat",
			icon: <DocumentTextIcon className="w-6" />,
			url: "/surat",
		},
	];

	// const tabUser = [
	// 	{
	// 		title: "MENU",
	// 		subtab: [
	// 			{
	// 				subtitle: "Dashboard",
	// 				url: "/",
	// 				icon: <HomeIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Surat Diterima",
	// 				url: "/dashboard/suratditerima",
	// 				quantity: receivedData?.length === 0 ? 0 : receivedData?.length,
	// 				icon: <DocumentArrowDownIcon className="w-6" />,
	// 			},
	// 		],
	// 	},
	// ];

	// const tabSuperuser = [
	// 	{
	// 		title: "MENU",
	// 		subtab: [
	// 			{
	// 				subtitle: "Dashboard",
	// 				url: "/",
	// 				icon: <HomeIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Surat Terkirim",
	// 				url: "/dashboard/suratterkirim",
	// 				quantity: sentData?.length === 0 ? 0 : sentData?.length,
	// 				icon: <DocumentArrowUpIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Surat Diterima",
	// 				url: "/dashboard/suratditerima",
	// 				quantity: receivedData?.length === 0 ? 0 : receivedData?.length,
	// 				icon: <DocumentArrowDownIcon className="w-6" />,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: "DAFTAR SURAT",
	// 		subtab: [
	// 			{
	// 				subtitle: "Surat Terbaru",
	// 				url: "/surat",
	// 				icon: <DocumentTextIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Disposisi",
	// 				url: "/surat/disposisi",
	// 				icon: <DocumentTextIcon className="w-6" />,
	// 			},
	// 		],
	// 	},
	// ];

	// const tabAdmin = [
	// 	{
	// 		title: "MENU",
	// 		subtab: [
	// 			{
	// 				subtitle: "Dashboard",
	// 				url: "/",
	// 				icon: <HomeIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Surat Terkirim",
	// 				url: "/dashboard/suratterkirim",
	// 				quantity: sentData?.length === 0 ? 0 : sentData?.length,
	// 				icon: <DocumentArrowUpIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Surat Diterima",
	// 				url: "/dashboard/suratditerima",
	// 				quantity: receivedData?.length === 0 ? 0 : receivedData?.length,
	// 				icon: <DocumentArrowDownIcon className="w-6" />,
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: "DAFTAR SURAT",
	// 		subtab: [
	// 			{
	// 				subtitle: "Surat Terbaru",
	// 				url: "/surat",
	// 				icon: <DocumentTextIcon className="w-6" />,
	// 			},
	// 			{
	// 				subtitle: "Disposisi",
	// 				url: "/surat/disposisi",
	// 				icon: <DocumentTextIcon className="w-6" />,
	// 			},
	// 		],
	// 	},
	// ];

	const tab: {
		title: string;
		subtab: {
			subtitle: string;
			url: string;
			quantity?: string | number;
			icon?: JSX.Element;
		}[];
	}[] = [
		{
			title: "MENU",
			subtab: [
				{
					subtitle: "Dashboard",
					url: "/",
					icon: <HomeIcon className="w-6" />,
				},
				session?.user.role !== "USER"
					? [
							{
								subtitle: "Surat Terkirim",
								url: "/dashboard/suratterkirim",
								quantity: sentData?.length === 0 ? 0 : sentData?.length,
								icon: <DocumentArrowUpIcon className="w-6" />,
							},
					  ]
					: [],
				{
					subtitle: "Surat Diterima",
					url: "/dashboard/suratditerima",
					quantity: receivedData?.length === 0 ? 0 : receivedData?.length,
					icon: <DocumentArrowDownIcon className="w-6" />,
				},
			].flat(),
		},
		session?.user.role !== "USER"
			? [
					{
						title: "DAFTAR SURAT",
						subtab: [
							{
								subtitle: "Surat Terbaru",
								url: "/surat",
								icon: <DocumentTextIcon className="w-6" />,
							},
							{
								subtitle: "Disposisi",
								url: "/surat/disposisi",
								icon: <DocumentTextIcon className="w-6" />,
							},
						],
					},
			  ]
			: [],
	].flat();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<>
			{/* ============================== FULL NAV ==============================*/}
			<nav className="hidden md:flex w-52 min-w-[224px] px-4 bg-gray-800 text-white">
				<ul className="flex flex-col gap-4 w-full">
					<li className="flex flex-col items-center gap-4 my-10">
						<img
							src="https://lskgemapedekabe.com/wp-content/uploads/2019/08/pdkb-e1566140008599.png"
							alt="logo"
							className="w-28"
						/>
						<h2 className="text-xl">GEMADISPOSISI</h2>
					</li>
					{tab.map((data, index) => {
						return (
							<li key={index} className="flex flex-col gap-1">
								<h2 className="text-gray-400">{data.title}</h2>
								{data?.subtab?.map((data, index) => {
									return (
										<Link
											key={index}
											href={data.url}
											className={`${
												router.pathname === data.url
													? "bg-black bg-opacity-30"
													: "hover:bg-white hover:bg-opacity-10"
											} flex justify-between px-3 py-2 rounded-md`}
										>
											<div className="flex gap-2">
												{data.icon}
												<p>{data.subtitle}</p>
											</div>
											{data?.quantity && (
												<>
													<p>{data?.quantity}</p>
													{data.subtitle === "Surat Diterima" ? (
														!readData[0]?.isRead && (
															<p className="absolute left-[204px] px-1.5 py-0.5 border-2 border-gray-800 rounded-full text-xs text-gray-800 bg-amber-400">
																BARU
															</p>
														)
													) : (
														<></>
													)}
												</>
											)}
										</Link>
									);
								})}
							</li>
						);
					})}
					{/* PROFILE */}
					<li className="flex flex-col gap-1">
						<h2 className="text-gray-400">PROFILE</h2>
						<div className="flex gap-2 px-3 py-2">
							<UserCircleIcon className="w-6" />
							<p>{session?.user?.name}</p>
						</div>
						{/* UNLOCK ADMIN FEATURES */}
						{/* {userData?.role === "ADMIN" && (
							<Link
								href="/kelolapengguna"
								className="flex gap-2 px-3 py-2 rounded-md hover:bg-white hover:bg-opacity-10"
							>
								<UsersIcon className="w-6" />
								<p>Kelola Pengguna</p>
							</Link>
						)} */}
						<div
							onClick={handleSignOut}
							className="flex gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-white hover:bg-opacity-10"
						>
							<PowerIcon className="w-6" />
							<p>Log Out</p>
						</div>
					</li>
				</ul>
			</nav>

			{/* ============================== MIN NAV ============================== */}
			<nav className="flex md:hidden items-center px-2 bg-gray-800 text-white">
				<ul className="flex flex-col gap-4 w-fit">
					{minimizeTab.map((data, index) => {
						return (
							<Link
								key={index}
								href={data.url}
								className="relative p-4 rounded-xl bg-white bg-opacity-10 transition-all duration-200 hover:rounded-3xl hover:bg-opacity-20 group"
							>
								{data.icon}
								<div className="origin-left absolute top-1 left-20 min-w-max px-4 py-3 rounded-xl bg-gray-800 scale-0 transition-all duration-150 group-hover:scale-100">
									{data.title}
								</div>
							</Link>
						);
					})}
					{/* LOG OUT */}
					<div
						onClick={handleSignOut}
						className="relative p-4 rounded-xl bg-white bg-opacity-10 cursor-pointer transition-all duration-200 hover:rounded-3xl hover:bg-opacity-20 group"
					>
						<PowerIcon className="w-6" />
						<div className="origin-left absolute top-1 left-20 min-w-max px-4 py-3 rounded-xl bg-gray-800 scale-0 transition-all duration-150 group-hover:scale-100">
							Log Out
						</div>
					</div>
				</ul>
			</nav>
		</>
	);
}
