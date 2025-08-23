import request from 'supertest';
import { server } from '../src/index.js';

describe('Health Endpoints', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(server.app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        ok: true,
        version: expect.any(String),
        timestamp: expect.any(String),
      });
    });

    it('should include correct headers', async () => {
      const response = await request(server.app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-api-version']).toBeDefined();
      expect(response.headers['cache-control']).toBe('public, max-age=30');
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(server.app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toMatchObject({
        ok: true,
        version: expect.any(String),
        timestamp: expect.any(String),
        environment: expect.any(String),
        uptime: expect.any(Number),
        memory: expect.objectContaining({
          used: expect.any(Number),
          total: expect.any(Number),
        }),
        services: expect.objectContaining({
          notion: expect.any(Boolean),
          airtable: expect.any(Boolean),
        }),
      });
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(server.app)
        .get('/health/ready')
        .expect(200);

      expect(response.body).toMatchObject({
        ready: true,
        timestamp: expect.any(String),
        services: expect.objectContaining({
          notion: true,
          airtable: true,
        }),
      });
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(server.app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toMatchObject({
        alive: true,
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      });
    });
  });
});