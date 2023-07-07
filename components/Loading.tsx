import { MoonLoader } from "react-spinners";

export default function Loading() {
	return (
		<div className="flex justify-center items-center w-screen h-screen">
			<MoonLoader
				color={"#1f2937"}
				loading={true}
				size={100}
				speedMultiplier={1.5}
			/>
		</div>
	);
}
