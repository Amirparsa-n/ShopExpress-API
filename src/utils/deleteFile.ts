import fs from 'fs';
import path from 'path';

/**
 * Deletes a file safely, ensuring it exists before attempting to delete.
 * @param relativeFilePath The relative path of the file (e.g., "uploads/images/file.webp").
 */
export function deleteFile(relativeFilePath: string): void {
    try {
        // Convert the relative path to an absolute path
        const absoluteFilePath = path.join(process.cwd(), 'public', relativeFilePath);

        // Check if the file exists
        if (fs.existsSync(absoluteFilePath)) {
            // Delete the file
            fs.unlinkSync(absoluteFilePath);
            console.log(`File deleted: ${relativeFilePath}`);
        } else {
            console.warn(`File not found: ${relativeFilePath}`);
        }
    } catch (error) {
        console.error(`Error deleting file: ${relativeFilePath}`, error);
    }
}
