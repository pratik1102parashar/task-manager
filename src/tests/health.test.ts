import request from 'supertest';
import express from 'express';
import app from '../app'; // or '../src/index' if you're exporting the app from there

describe('Health Check', () => {
    it('should return 200 OK with status and timestamp', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            status: 'OK',
            timestamp: expect.any(String),
        });
    });
});
