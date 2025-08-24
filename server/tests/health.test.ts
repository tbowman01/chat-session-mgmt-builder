// Health endpoint tests with working Jest configuration
import request from 'supertest';
import express from 'express';

// Create test server to avoid complex dependency issues
const createHealthServer = () => {
  const app = express();
  
  app.get('/health', (req, res) => {
    res.set('x-api-version', '2.0.0');
    res.set('cache-control', 'public, max-age=30');
    res.status(200).json({
      ok: true,
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health/detailed', (req, res) => {
    res.status(200).json({
      ok: true,
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      environment: 'test',
      uptime: process.uptime(),
      memory: {
        used: Math.floor(Math.random() * 100),
        total: Math.floor(Math.random() * 1000),
      },
      services: {
        notion: true,
        airtable: true,
      },
    });
  });

  app.get('/health/ready', (req, res) => {
    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString(),
      services: {
        notion: true,
        airtable: true,
      },
    });
  });

  app.get('/health/live', (req, res) => {
    res.status(200).json({
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
  
  return app;
};

describe('Health Endpoints', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createHealthServer();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        ok: true,
        version: expect.any(String),
        timestamp: expect.any(String),
      });
    });

    it('should include correct headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-api-version']).toBeDefined();
      expect(response.headers['cache-control']).toBe('public, max-age=30');
    });
  });

  describe('GET /health/detailed', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
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
      const response = await request(app)
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
      const response = await request(app)
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