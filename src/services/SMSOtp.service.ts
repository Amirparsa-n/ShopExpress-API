// eslint-disable-next-line @typescript-eslint/require-await
export const sendSmsOtp = async (phone: string, otp: string) => {
    console.log(`OTP for ${phone} : ${otp}`);
};
