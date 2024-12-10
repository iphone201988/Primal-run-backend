import { NextFunction } from "connect";
import { Request, Response } from "express";
import mongoose from "mongoose";

type ResponseData = Record<string, any>;

export const connectToDB = () => mongoose.connect(process.env.MONGO_URI);

export const TryCatch =
  (func: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(func(req, res, next)).catch(next);

export const SUCCESS = (
  res: Response,
  status: number,
  message: string,
  data?: ResponseData
): ResponseData => {
  return res.status(status).json({
    success: true,
    message,
    ...(data ? data : {}),
  });
};

export const getFiles = (req: Request, fileNames: Array<string>) => {
  // Single file uploaded
  if (fileNames.length == 1 && req.file) {
    return {
      [fileNames[0]]: "/uploads/" + req.file.filename,
    };
  }

  // Multiple files uploaded
  const files: any = {};
  fileNames.forEach((fileKey: string) => {
    if (req.files && req.files[fileKey]) {
      files[fileKey] = req.files[fileKey].map((file: any) => {
        let path = "";
        if (file.mimetype.includes("audio")) path = "/uploads/sounds/";
        if (file.mimetype.includes("image")) path = "/uploads/images/";
        if (file.mimetype.includes("video")) path = "/uploads/videos/";
        return path + file.filename;
      });
    }
  });
  if (Object.keys(files).length) return files;

  return null;
};

const convertKmToMiles = (data: any, keys: Array<string>) => {
  const conversionFactor = 0.621371; // 1 km = 0.621371 miles

  const finalData = data.map((item: any) => {
    keys.forEach((keyName: string) => {
      item = {
        ...item,
        [keyName]: item[keyName] * conversionFactor,
      };
    });
    return item;
  });

  return finalData;
};

export const completeUrls = (data: any, keys: string[]) => {
  const finalData = data.map((item: any) => {
    keys.forEach((keyName: string) => {
      item = {
        ...item,
        [keyName]: process.env.BACKEND_URL + item[keyName],
      };
    });
    return item;
  });

  return finalData;
};
