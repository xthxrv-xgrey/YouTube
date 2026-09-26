import { Router } from "express";

import imageUpload from "#core/middlewares/upload/imageUpload.js";
import videoUpload from "#core/middlewares/upload/videoUpload.js";

import { uploadImage } from "#integrations/media/image.provider.js";
import { uploadVideo } from "#integrations/media/video.provider.js";

const router = Router();

router.post(
  "/uploadImage",
  imageUpload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const result = await uploadImage({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/youtube/test",
      });

      return res.status(200).json({
        message: "Upload successful",
        result,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/uploadVideo",
  videoUpload.single("video"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No video uploaded",
        });
      }

      const result = await uploadVideo(req.file.buffer);

      return res.status(200).json({
        message: "Video upload successful",
        result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
