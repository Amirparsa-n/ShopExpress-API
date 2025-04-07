// Utility functions for size conversions

/**
 * Convert bytes to kilobytes.
 * @param bytes - The size in bytes.
 * @returns The size in kilobytes.
 */
export function bytesToKilobytes(bytes: number): number {
    return bytes / 1024;
}

/**
 * Convert kilobytes to megabytes.
 * @param kilobytes - The size in kilobytes.
 * @returns The size in megabytes.
 */
export function kilobytesToMegabytes(kilobytes: number): number {
    return kilobytes / 1024;
}

/**
 * Convert megabytes to gigabytes.
 * @param megabytes - The size in megabytes.
 * @returns The size in gigabytes.
 */
export function megabytesToGigabytes(megabytes: number): number {
    return megabytes / 1024;
}

/**
 * Convert gigabytes to terabytes.
 * @param gigabytes - The size in gigabytes.
 * @returns The size in terabytes.
 */
export function gigabytesToTerabytes(gigabytes: number): number {
    return gigabytes / 1024;
}

/**
 * Convert kilobytes to bytes.
 * @param kilobytes - The size in kilobytes.
 * @returns The size in bytes.
 */
export function kilobytesToBytes(kilobytes: number): number {
    return kilobytes * 1024;
}

/**
 * Convert megabytes to kilobytes.
 * @param megabytes - The size in megabytes.
 * @returns The size in kilobytes.
 */
export function megabytesToKilobytes(megabytes: number): number {
    return megabytes * 1024;
}

/**
 * Convert gigabytes to megabytes.
 * @param gigabytes - The size in gigabytes.
 * @returns The size in megabytes.
 */
export function gigabytesToMegabytes(gigabytes: number): number {
    return gigabytes * 1024;
}

/**
 * Convert megabytes to bytes.
 * @param megabytes - The size in megabytes.
 * @returns The size in bytes.
 */
export function megabytesToBytes(megabytes: number): number {
    return megabytes * 1024 * 1024;
}
