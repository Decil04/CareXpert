import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('POST /api/analyse', () => {
  it('should return mock analysis for a text file', async () => {
    const response = await request(app)
      .post('/api/analyse')
      .attach('document', Buffer.from('Patient has common cold and fever'), 'prescription.txt')
      .query({ age: '30', language: 'en' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('diagnosis');
    expect(response.body).toHaveProperty('medications');
    expect(Array.isArray(response.body.medications)).toBe(true);
    expect(response.body.diagnosis).toContain('Respiratory Infection');
    console.log('[Test:Analyse] Received success response with mock data');
  });

  it('should return 400 if no document is uploaded', async () => {
    const response = await request(app)
      .post('/api/analyse');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No document uploaded');
  });

  it('should return 400 for unsupported file types', async () => {
    const response = await request(app)
      .post('/api/analyse')
      .attach('document', Buffer.from('invalid'), 'test.exe');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_MIME_TYPE');
  });
});
