import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export type FileType = 'audio' | 'file' | 'image' | 'video';

const storage = multer.memoryStorage();

export const validMimeTypes = {
    image: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    video: ['video/mp4', 'video/mkv', 'video/webm'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    file: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
};

const fileFilterHandler = (type: FileType) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const mimeType = file.mimetype;

        // Validation mimetype
        if (!validMimeTypes[type].includes(mimeType)) {
            const error: any = new Error(
                `Invalid file type for ${type}. Valid formats are: ${validMimeTypes[type].join(', ')}`
            );
            error.multerError = true;
            return cb(error);
        }

        cb(null, true);
    };
};

export const uploader = (maxSizeInMB: number, type: FileType) => {
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
