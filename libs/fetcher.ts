import axios from "axios";
import useSWR from "swr";

const fetcher = async (url: string) =>
	await axios.get(url).then((res) => res.data);

export default async function useFetcher(session: any, url: string) {
	const { data, error, isLoading } = useSWR(session ? url : null, fetcher, {
		refreshInterval: 1000,
	});
	return { data, error, isLoading };
}
