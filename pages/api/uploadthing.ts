import { createNextPageApiHandler } from "uploadthing/next-legacy";

import { ourFileRouter } from "@/server/core";

const handler = createNextPageApiHandler({
	router: ourFileRouter,
});

export default handler;
