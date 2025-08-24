import request from 'supertest';
import { Server } from '../src/server.js';
import { userService } from '../src/services/auth/userService.js';
import { generateAccessToken, generateRefreshToken } from '../src/utils/jwt.js';

describe('Authentication API', () => {
  let server: Server;
  let app: any;

  beforeAll(() => {
    server = new Server();
    app = server.app;
  });

  afterAll(async () => {
    await server.stop();
  });

  describe('POST /api/auth/register', () => {
    const validRegistration = {
      email: 'test@example.com',
      password: 'TestPass123!',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validRegistration)
        .expect(201);

      expect(response.body).toMatchObject({
        user: expect.objectContaining({
          email: validRegistration.email,
          name: validRegistration.name,
          role: 'user',
          provider: 'local',
          isActive: true,
        }),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: 900, // 15 minutes
      });

      // Should set cookies
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].some((cookie: string) => cookie.includes('access_token'))).toBe(true);
      expect(response.headers['set-cookie'].some((cookie: string) => cookie.includes('refresh_token'))).toBe(true);
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validRegistration,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
      });
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validRegistration,
          password: 'weak',
        })
        .expect(400);

      expect(response.body).toMatchObject({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
      });
    });

    it('should reject registration with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'TestPass123!',
          name: 'First User',
        })
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'TestPass123!',
          name: 'Second User',
        })
        .expect(409);

      expect(response.body).toMatchObject({
        error: 'User already exists',
        code: 'USER_EXISTS',
      });
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: 'login@example.com',
      password: 'TestPass123!',
      name: 'Login Test User',
    };

    beforeAll(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toMatchObject({
        user: expect.objectContaining({
          email: testUser.email,
          name: testUser.name,
          role: 'user',
        }),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: 900,
      });

      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should login successfully with admin credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'any-password', // Demo mode accepts any password
        })
        .expect(200);

      expect(response.body).toMatchObject({
        user: expect.objectContaining({
          email: 'admin@example.com',
          role: 'admin',
        }),
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: testUser.password,
        })
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;
    let userId: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'any-password',
        })
        .expect(200);

      refreshToken = response.body.refreshToken;
      userId = response.body.user.id;
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: 900,
      });

      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.code).toBe('INVALID_REFRESH_TOKEN');
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;
    let user: any;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'any-password',
        })
        .expect(200);

      accessToken = response.body.accessToken;
      user = response.body.user;
    });

    it('should return current user info', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        user: expect.objectContaining({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      });
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.code).toBe('MISSING_TOKEN');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'any-password',
        })
        .expect(200);

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Logged out successfully',
      });

      // Should clear cookies
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].some((cookie: string) => cookie.includes('access_token=;'))).toBe(true);
    });

    it('should reject logout without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.code).toBe('MISSING_TOKEN');
    });
  });

  describe('POST /api/auth/logout-all', () => {
    let accessToken: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'any-password',
        })
        .expect(200);

      accessToken = response.body.accessToken;
    });

    it('should logout from all devices successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Logged out from all devices successfully',
      });
    });
  });

  describe('GET /api/auth/status', () => {
    it('should return unauthenticated status without token', async () => {
      const response = await request(app)
        .get('/api/auth/status')
        .expect(200);

      expect(response.body).toMatchObject({
        authenticated: false,
        message: 'No authentication token provided',
      });
    });

    it('should return authenticated status with valid token', async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'any-password',
        })
        .expect(200);

      const response = await request(app)
        .get('/api/auth/status')
        .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        authenticated: true,
        user: expect.objectContaining({
          id: expect.any(String),
          email: 'admin@example.com',
          role: 'admin',
        }),
      });
    });
  });

  describe('GET /api/auth/providers', () => {
    it('should return available OAuth providers', async () => {
      const response = await request(app)
        .get('/api/auth/providers')
        .expect(200);

      expect(response.body).toMatchObject({
        providers: expect.any(Array),
        localAuth: true,
      });

      // Should include GitHub and Google if configured
      const providerNames = response.body.providers.map((p: any) => p.name);
      expect(providerNames).toEqual(expect.arrayContaining(['github', 'google']));
    });
  });
});