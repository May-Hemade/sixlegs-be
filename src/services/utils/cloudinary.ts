import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v4 as uniqId } from "uuid"

process.env.TS_NODE_DEV && require("dotenv").config()

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
})

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "six-legs",
    format: async (req: any, file: any) => "png",
    public_id: (req: any, file: any) => uniqId(),
  } as { folder: string },
})

const parser = multer({ storage: cloudinaryStorage })

export { parser, cloudinary }
