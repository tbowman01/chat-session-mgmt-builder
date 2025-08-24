import { User, Session, OAuthProfile } from '../../types/index.js';
import { generateTokenPair } from '../../utils/jwt.js';
import logger from '../../utils/logger.js';

/**
 * In-memory user storage (replace with database in production)
 */
class UserService {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, Session> = new Map();
  private emailToUserId: Map<string, string> = new Map();

  constructor() {
    // Create a default admin user for testing
    const adminUser: User = {
      id: 'admin-001',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      provider: 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true,
      isActive: true,
    };

    this.users.set(adminUser.id, adminUser);
    this.emailToUserId.set(adminUser.email, adminUser.id);
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailToUserId.get(email);
    return userId ? this.users.get(userId) || null : null;
  }

  /**
   * Find user by provider ID
   */
  async findByProviderId(provider: string, providerId: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.provider === provider && user.providerId === providerId) {
        return user;
      }
    }
    return null;
  }

  /**
   * Create new user
   */
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, user);
    this.emailToUserId.set(user.email, id);

    logger.info('User created', { userId: id, email: user.email, provider: user.provider });

    return user;
  }

  /**
   * Create user from OAuth profile
   */
  async createFromOAuth(profile: OAuthProfile): Promise<User> {
    return await this.createUser({
      email: profile.email,
      name: profile.name,
      role: 'user',
      provider: profile.provider,
      providerId: profile.id,
      avatar: profile.avatar,
      emailVerified: true, // OAuth providers typically verify emails
      isActive: true,
    });
  }

  /**
   * Update user
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);

    // Update email index if email changed
    if (updates.email && updates.email !== user.email) {
      this.emailToUserId.delete(user.email);
      this.emailToUserId.set(updates.email, id);
    }

    logger.info('User updated', { userId: id, updatedFields: Object.keys(updates) });

    return updatedUser;
  }

  /**
   * Update last login time
   */
  async updateLastLogin(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.users.set(userId, user);
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    this.users.delete(id);
    this.emailToUserId.delete(user.email);

    // Delete associated sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === id) {
        this.sessions.delete(sessionId);
      }
    }

    logger.info('User deleted', { userId: id, email: user.email });

    return true;
  }

  /**
   * Create session
   */
  async createSession(userId: string, refreshToken: string, userAgent?: string, ipAddress?: string): Promise<Session> {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session: Session = {
      id: sessionId,
      userId,
      refreshToken,
      expiresAt,
      createdAt: now,
      lastUsedAt: now,
      userAgent,
      ipAddress,
      isActive: true,
    };

    this.sessions.set(sessionId, session);

    logger.info('Session created', { sessionId, userId });

    return session;
  }

  /**
   * Find session by refresh token
   */
  async findSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
    for (const session of this.sessions.values()) {
      if (session.refreshToken === refreshToken && session.isActive) {
        return session;
      }
    }
    return null;
  }

  /**
   * Update session last used time
   */
  async updateSessionLastUsed(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastUsedAt = new Date();
      this.sessions.set(sessionId, session);
    }
  }

  /**
   * Invalidate session
   */
  async invalidateSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.set(sessionId, session);
      logger.info('Session invalidated', { sessionId });
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateAllUserSessions(userId: string): Promise<void> {
    for (const session of this.sessions.values()) {
      if (session.userId === userId && session.isActive) {
        session.isActive = false;
        this.sessions.set(session.id, session);
      }
    }
    logger.info('All sessions invalidated for user', { userId });
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Expired sessions cleaned up', { count: cleanedCount });
    }
  }

  /**
   * Get user statistics
   */
  async getStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    activeSessions: number;
    usersByProvider: Record<string, number>;
  }> {
    const totalUsers = this.users.size;
    const activeUsers = Array.from(this.users.values()).filter(user => user.isActive).length;
    const activeSessions = Array.from(this.sessions.values()).filter(session => session.isActive).length;
    
    const usersByProvider: Record<string, number> = {};
    for (const user of this.users.values()) {
      usersByProvider[user.provider] = (usersByProvider[user.provider] || 0) + 1;
    }

    return {
      totalUsers,
      activeUsers,
      activeSessions,
      usersByProvider,
    };
  }

  /**
   * List all users (admin only)
   */
  async listUsers(page: number = 1, limit: number = 50): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const users = Array.from(this.users.values());
    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      users: users.slice(start, end),
      total,
      page,
      totalPages,
    };
  }
}

// Export singleton instance
export const userService = new UserService();

// Clean up expired sessions every hour
setInterval(() => {
  userService.cleanupExpiredSessions();
}, 60 * 60 * 1000);