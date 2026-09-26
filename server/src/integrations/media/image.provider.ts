import { imageKit } from "./providers/imagekit.service.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const uploadImage = async ({
  file,
  fileName,
  folder,
}: {
  file: Buffer;
  fileName: string;
  folder?: string;
}) => {
  const tempFileName = `${crypto.randomUUID()}-${fileName}`;
  const tempFilePath = path.join("tmp", tempFileName);

  try {
    await fs.promises.mkdir("tmp", { recursive: true });

    await fs.promises.writeFile(tempFilePath, file);

    const result = await imageKit.files.upload({
      file: fs.createReadStream(tempFilePath),
      fileName: tempFileName,
      folder,
    });

    return result;
  } finally {
    await fs.promises.unlink(tempFilePath).catch(() => {});
  }
};
