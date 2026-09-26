import env from "#config/env.js";
import ImageKit from "@imagekit/nodejs";

export const imageKit = new ImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY as string,
});
