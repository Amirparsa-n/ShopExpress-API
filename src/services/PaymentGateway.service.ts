import { config } from '@configs/config';

interface CreatePaymentProps {
    amountInRial: number;
    description: string;
    mobile: string;
}

export const createPaymentGateway = async ({ amountInRial, description, mobile }: CreatePaymentProps) => {
    const response = await fetch(config.get('zarinpal.requestApiUrl'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            merchant_id: config.get('zarinpal.merchantId'),
            amount: amountInRial,
            description,
            callback_url: config.get('zarinpal.callback_url'),
            metadata: {
                mobile,
            },
        }),
    });
    const data = await response.json();
    return { authority: data.data.authority, paymentUrl: config.get('zarinpal.paymentStartUrl') + data.data.authority };
};

interface VerifyPaymentProps {
    amountInRial: number;
    authority: string;
}

export const verifyPayment = async ({ amountInRial, authority }: VerifyPaymentProps) => {
    const response = await fetch(config.get('zarinpal.verityApiUrl'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            merchant_id: config.get('zarinpal.merchantId'),
            amount: amountInRial,
            authority,
        }),
    });
    const data = await response.json();
    console.log('🚀 ~ verifyPayment ~ data:', data);

    return data.data;
};
