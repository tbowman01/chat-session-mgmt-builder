// Core configuration types
export interface Config {
  platform: PlatformId;
  priorities: PriorityId[];
  features: FeatureId[];
  teamSize: TeamSizeId;
  complexity: ComplexityId;
}

export type PlatformId = 'notion' | 'airtable' | 'sheets' | 'excel' | 'obsidian' | 'logseq' | 'custom';
export type PriorityId = 'organization' | 'search' | 'collaboration' | 'analytics' | 'automation';
export type FeatureId = 'projects' | 'tags' | 'reminders' | 'exports' | 'dashboard' | 'templates';
export type TeamSizeId = 'just-me' | '2-5-people' | '6-20-people' | '20+-people';
export type ComplexityId = 'simple' | 'moderate' | 'advanced';

// API Request/Response types
export interface ProvisionNotionRequest {
  parentPageId: string;
  config: Config;
}

export interface ProvisionNotionResponse {
  url: string;
  id: string;
  properties: Record<string, string>;
  views: string[];
}

export interface ProvisionAirtableRequest {
  baseId: string;
  seedSample?: boolean;
  config?: Config;
}

export interface ProvisionAirtableResponse {
  url: string;
  table: string;
  sampleRecordId?: string;
  fields: string[];
  recordCount: number;
}

export interface HealthResponse {
  ok: boolean;
  timestamp: string;
  version: string;
}

// Error types
export interface ApiError {
  error: string;
  code: string;
  details: string;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR';
  fields: string[];
}

// Notion-specific types
export interface NotionProperty {
  name: string;
  type: 'title' | 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'checkbox' | 'url' | 'email' | 'phone_number' | 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by';
  config?: any;
}

export interface NotionDatabase {
  title: string;
  properties: NotionProperty[];
  views: NotionView[];
}

export interface NotionView {
  name: string;
  type: 'table' | 'board' | 'timeline' | 'calendar' | 'gallery' | 'list';
  filter?: any;
  sort?: any;
}

// Airtable-specific types
export interface AirtableField {
  name: string;
  type: 'singleLineText' | 'multilineText' | 'singleSelect' | 'multipleSelects' | 'number' | 'percent' | 'currency' | 'singleCollaborator' | 'multipleCollaborators' | 'date' | 'phoneNumber' | 'email' | 'url' | 'checkbox' | 'rating' | 'duration' | 'attachment' | 'barcode' | 'button';
  options?: any;
}

export interface AirtableTable {
  name: string;
  fields: AirtableField[];
}

// Server types
export interface ServerConfig {
  port: number;
  environment: string;
  apiVersion: string;
  allowedOrigins: string[];
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    maxConcurrent: number;
  };
  notion: {
    token: string;
  };
  airtable: {
    token: string;
  };
  logging: {
    level: string;
    file: string;
  };
  auth: {
    jwtSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string;
    github: {
      clientId: string;
      clientSecret: string;
      callbackUrl: string;
    };
    google: {
      clientId: string;
      clientSecret: string;
      callbackUrl: string;
    };
    session: {
      secret: string;
      maxAge: number;
    };
  };
}

// Middleware types
export interface RateLimitStore {
  incr(key: string): number;
  decrement(key: string): void;
  resetTime(key: string): Date;
  resetAll(): void;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  endpoint?: string;
  method?: string;
  status?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  error?: any;
}

// Provisioning job types
export interface ProvisioningJob {
  id: string;
  platform: PlatformId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  result?: any;
  error?: Error;
}

// Service types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface NotionServiceConfig {
  token: string;
  version: string;
}

export interface AirtableServiceConfig {
  token: string;
  endpointUrl: string;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  provider: 'local' | 'github' | 'google';
  providerId?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  emailVerified: boolean;
  isActive: boolean;
}

export interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  userAgent?: string;
  ipAddress?: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'github' | 'google';
}

import { Request } from 'express';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'user';
      provider: 'local' | 'github' | 'google';
      providerId?: string;
      avatar?: string;
      createdAt: Date;
      updatedAt: Date;
      lastLogin?: Date;
      emailVerified: boolean;
      isActive: boolean;
    }
    
    interface Request {
      user?: User;
      authSession?: Session;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  authSession?: Session;
}