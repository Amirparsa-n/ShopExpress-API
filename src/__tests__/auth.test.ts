/* eslint-disable n/no-unpublished-import */
import '../configs/loadTestEnv';

import type TestAgent from 'supertest/lib/agent';

import supertest from 'supertest';

import { bootstrap } from '../index';

let server: any;
let request: TestAgent<supertest.Test>;

beforeAll(async () => {
    server = await bootstrap();
    request = supertest(server);
});

afterAll(async () => {
    if (server) {
        await server.close();
    }
});

describe('sendOTP', () => {
    test('200', async () => {
        const response = await request.post('/api/auth/sendOTP').send({ phone: '09123456789' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('OTP sent successfully');
    });

    test('validation 400', async () => {
        const response = await request.post('/api/auth/sendOTP').send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Phone number is required');
    });

    test('banned users', async () => {
        // Assuming a banned phone number exists in the database
        const response = await request.post('/api/auth/sendOTP').send({ phone: '09111111111' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are banned from using this service');
    });
});
