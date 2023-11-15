import { generateComponents } from "@uploadthing/react";

import type { OurFileRouter } from "@/server/core";

export const { UploadButton, UploadDropzone, Uploader } =
	generateComponents<OurFileRouter>();
