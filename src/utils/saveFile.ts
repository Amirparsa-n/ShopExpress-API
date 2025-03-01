import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * Handles file upload and processing (compression for images).
 * @param file The uploaded file object (from multer).
 * @param uploadDir The directory where the file should be saved.
 * @param compressOptions Options for image compression (optional).
 * @returns The final path of the saved file.
 * @throws Error if any issue occurs during file processing or saving.
 */
export async function saveFile(
    file: Express.Multer.File | undefined,
    uploadDir: string,
    compressOptions?: { width?: number; quality?: number }
): Promise<string> {
    if (!file) {
        throw new Error('No file provided.');
    }

    // Create the upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    let finalPath: string;

    try {
        // If the file is an image and compression options are provided
        if (file.mimetype.startsWith('image/')) {
            // const tempPath = path.join(uploadDir, `temp-${Date.now()}-${file.originalname}`);
            const outputFilePath = path.join(
                uploadDir,
                `${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}.webp`
            );

            // Compress the image
            await sharp(file.buffer)
                .resize({ width: compressOptions?.width ?? 1200 })
                .webp({ quality: compressOptions?.quality ?? 80 })
                .toFile(outputFilePath);

            finalPath = outputFilePath;
        } else {
            // Save the file as-is if not an image or no compression options provided
            finalPath = path.join(uploadDir, `${Date.now()}-${file.originalname}`);
            fs.writeFileSync(finalPath, file.buffer);
        }

        const relativePath = path.relative(process.cwd(), finalPath);
        const cleanPath = relativePath.replace(/^public[\\/]/, ''); // Remove "public/" or "public\"
        return cleanPath.replace(/\\/g, '/');
    } catch (error) {
        console.error('Error processing file:', error);
        throw new Error('Failed to process and save the file.');
    }
}
