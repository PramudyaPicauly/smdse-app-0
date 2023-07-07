// NEXT
import { useRouter } from "next/router";
import { Ubuntu } from "next/font/google";
import React, { useEffect } from "react";

// D
import { useSession } from "next-auth/react";

// COMP
import Sidebar from "./Sidebar";
import Loading from "./Loading";

const fontstyle = Ubuntu({
	weight: ["400", "700"],
	subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
	// const router = useRouter();
	// const { status } = useSession();

	// if (status === "loading" || children === null) return <Loading />;

	// if (status === "unauthenticated") return <>{children}</>;

	// if (status === "authenticated")
	// 	return (
	// 		<main className={`${fontstyle.className} flex min-h-screen`}>
	// 			<Sidebar />
	// 			<div className="w-full px-8">{children}</div>
	// 		</main>
	// 	);
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") router.replace("/auth/signin");
	}, [status]);

	return status === "authenticated" ? (
		<main className={`${fontstyle.className} flex min-h-screen`}>
			<Sidebar />
			<div className="w-full px-8">{children}</div>
		</main>
	) : (
		<Loading />
	);
}
