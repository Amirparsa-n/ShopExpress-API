import redis from '@configs/redis';
import bcrypt from 'bcrypt';

export function getOtpRedisPattern(phone: string): string {
    return `otp:${phone}`;
}

export async function generateOtp(phone: string, length = 5, expireTime = 1) {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    const hashedOtp = await bcrypt.hash(otp, 12);

    await redis.set(getOtpRedisPattern(phone), hashedOtp, 'EX', expireTime * 60);

    return otp;
}

export async function getOtpDetails(phone: string) {
    const otp = await redis.get(getOtpRedisPattern(phone));
    if (!otp) {
        return {
            expired: true,
            remainingTime: 0,
        };
    }

    const remainingTime = await redis.ttl(getOtpRedisPattern(phone)); // Second
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60; // "01:20"
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return {
        expired: false,
        remainingTime: formattedTime,
    };
}
