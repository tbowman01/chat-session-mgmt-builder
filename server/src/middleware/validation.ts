import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { 
  validateNotionPageId, 
  validateAirtableBaseId, 
  sanitizeString,
  validateRequestSize 
} from '@/utils/security.js';
import { logError } from '@/utils/logger.js';

// Validation schemas
const configSchema = Joi.object({
  platform: Joi.string().valid('notion', 'airtable', 'sheets', 'excel', 'obsidian', 'logseq', 'custom').required(),
  priorities: Joi.array().items(
    Joi.string().valid('organization', 'search', 'collaboration', 'analytics', 'automation')
  ).min(1).required(),
  features: Joi.array().items(
    Joi.string().valid('projects', 'tags', 'reminders', 'exports', 'dashboard', 'templates')
  ).min(1).required(),
  teamSize: Joi.string().valid('just-me', '2-5-people', '6-20-people', '20+-people').required(),
  complexity: Joi.string().valid('simple', 'moderate', 'advanced').required(),
});

const provisionNotionSchema = Joi.object({
  parentPageId: Joi.string().length(32).pattern(/^[a-zA-Z0-9\-]+$/).required()
    .messages({
      'string.length': 'Parent page ID must be exactly 32 characters',
      'string.pattern.base': 'Parent page ID contains invalid characters',
    }),
  config: configSchema.required(),
});

const provisionAirtableSchema = Joi.object({
  baseId: Joi.string().pattern(/^app[a-zA-Z0-9]{14}$/).required()
    .messages({
      'string.pattern.base': 'Base ID must start with "app" followed by 14 alphanumeric characters',
    }),
  seedSample: Joi.boolean().optional().default(false),
  config: configSchema.optional(),
});

/**
 * Generic validation middleware factory
 */
export function validate(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check request size first
    if (!validateRequestSize(req)) {
      res.status(413).json({
        error: 'Request too large',
        code: 'REQUEST_TOO_LARGE',
        details: 'Request body exceeds maximum allowed size',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value,
      }));
      
      logError(error, {
        endpoint: req.originalUrl,
        method: req.method,
        body: req.body,
        validationErrors,
      });
      
      res.status(400).json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: 'One or more fields are invalid',
        fields: validationErrors,
        timestamp: new Date().toISOString(),
      });
      return;
    }
    
    // Sanitize string values
    req.body = sanitizeObject(value);
    next();
  };
}

/**
 * Sanitize all string values in an object
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Custom validation middleware for Notion page IDs
 */
export function validateNotionPageIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { parentPageId } = req.body;
  
  if (!validateNotionPageId(parentPageId)) {
    res.status(400).json({
      error: 'Invalid Notion page ID format',
      code: 'INVALID_NOTION_PAGE_ID',
      details: 'Notion page ID must be 32 characters long and contain only alphanumeric characters and hyphens',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  next();
}

/**
 * Custom validation middleware for Airtable base IDs
 */
export function validateAirtableBaseIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { baseId } = req.body;
  
  if (!validateAirtableBaseId(baseId)) {
    res.status(400).json({
      error: 'Invalid Airtable base ID format',
      code: 'INVALID_AIRTABLE_BASE_ID',
      details: 'Airtable base ID must start with "app" followed by 14 alphanumeric characters',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  next();
}

/**
 * Content-Type validation middleware
 */
export function validateContentType(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    const contentType = req.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      res.status(415).json({
        error: 'Unsupported Media Type',
        code: 'INVALID_CONTENT_TYPE',
        details: 'Content-Type must be application/json',
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }
  
  next();
}

// Export validation schemas for use in routes
export const validationSchemas = {
  provisionNotion: provisionNotionSchema,
  provisionAirtable: provisionAirtableSchema,
  config: configSchema,
};

export default validate;