import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session} basePath="/api/auth">
			{/* <ToastContainer /> */}
			<Component {...pageProps} />
		</SessionProvider>
	);
}
