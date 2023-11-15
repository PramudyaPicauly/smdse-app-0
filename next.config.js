/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// experimental: {
	// 	largePageDataBytes: 128 * 100000,
	// },
	images: {
		images: { domains: ["utfs.io"] },
	},
	rewrites: async () => {
		return [
			{
				source: "/html",
				destination: "/html/index.html",
			},
		];
	},
};

module.exports = nextConfig;
