import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import { Request } from 'express';

type Type = 'image' | 'video' | 'audio' | 'file';

const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         let folderPath: string;
//         const mimeType = file.mimetype;

//         if (mimeType.startsWith('image/')) {
//             folderPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'images');
//         } else if (mimeType.startsWith('video/')) {
//             folderPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'videos');
//         } else if (mimeType.startsWith('audio/')) {
//             folderPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'audio');
//         } else {
//             folderPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'files');
//         }

//         fs.mkdirSync(folderPath, { recursive: true });
//         cb(null, folderPath);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

const validMimeTypes = {
    image: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    video: ['video/mp4', 'video/mkv', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    file: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
};

const fileFilterHandler = (type: Type) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const mimeType = file.mimetype;

        // Validation mimetype
        if (!validMimeTypes[type].includes(mimeType)) {
            const error: any = new Error(
                `Invalid file type for ${type}. Valid formats are: ${validMimeTypes[type].join(', ')}`
            );
            error['multerError'] = true;
            return cb(error);
        }

        cb(null, true);
    };
};

export const uploader = (maxSizeInMB: number, type: Type) => {
    return multer({
        storage,
        fileFilter: fileFilterHandler(type),
        limits: { fileSize: 1024 * 1024 * maxSizeInMB },
    });
};

export const compressImage = async (file: Express.Multer.File): Promise<void> => {
    const mimeType = file.mimetype;

    if (mimeType.startsWith('image/')) {
        const outputPath = path.join(
            path.dirname(file.path),
            `c-${path.basename(file.filename, path.extname(file.filename))}.webp`
        );

        try {
            await sharp(file.path).resize({ width: 1200 }).webp({ quality: 80 }).toFile(outputPath);

            fs.unlinkSync(file.path);
            fs.renameSync(outputPath, file.path);
        } catch (error) {
            console.error('Error processing image:', error);
            throw new Error('Failed to compress the image.');
        }
    }
};
