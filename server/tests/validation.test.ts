import request from 'supertest';
import { server } from '../src/index.js';

describe('API Validation', () => {
  describe('Content-Type Validation', () => {
    it('should reject requests without application/json content-type', async () => {
      await request(server.app)
        .post('/api/provision/notion')
        .send('invalid content')
        .expect(415);
    });

    it('should accept requests with application/json content-type', async () => {
      // This will fail validation but should pass content-type check
      await request(server.app)
        .post('/api/provision/notion')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400); // Bad request due to missing fields, not 415
    });
  });

  describe('Request Size Validation', () => {
    it('should handle normal-sized requests', async () => {
      const response = await request(server.app)
        .post('/api/provision/notion')
        .send({
          parentPageId: 'test123456789012345678901234567890',
          config: {
            platform: 'notion',
            priorities: ['organization'],
            features: ['projects'],
            teamSize: 'just-me',
            complexity: 'simple',
          },
        });

      // Should get validation error, not size error
      expect(response.status).not.toBe(413);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize malicious input', async () => {
      const response = await request(server.app)
        .post('/api/provision/notion')
        .send({
          parentPageId: 'test123456789012345678901234567890',
          config: {
            platform: 'notion<script>alert(1)</script>',
            priorities: ['organization'],
            features: ['projects'],
            teamSize: 'just-me',
            complexity: 'simple',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Route Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(server.app)
        .get('/api/non-existent')
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Route not found',
        code: 'ROUTE_NOT_FOUND',
        timestamp: expect.any(String),
      });
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(server.app)
        .get('/health')
        .expect(200);

      expect(response.headers).toMatchObject({
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'x-xss-protection': '0',
      });
    });
  });
});