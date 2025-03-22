import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { config } from '../config/enviroment';

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.dirs.videos);
  },
  filename: (req, file, cb) => {
    // Create a more SEO-friendly filename while preserving original name
    const originalName = path.parse(file.originalname).name;
    const sanitizedName = originalName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const uniqueName = `${sanitizedName}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Filter function to check file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = config.fileUpload.allowedTypes;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files allowed (mp4, mkv, avi, mov, wmv)'));
  }
};

// Create and export the upload middleware
export const uploadMiddleware = multer({
  storage: storage,
  limits: { fileSize: config.fileUpload.maxSize },
  fileFilter
}).single('video');