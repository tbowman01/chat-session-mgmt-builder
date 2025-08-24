import Joi from 'joi';
import { CreateChatDTO, UpdateChatDTO, ChatFilters, Priority } from '@/common/types/chat.types';

const priorityValues: Priority[] = ['low', 'medium', 'high'];
const messageTypeValues = ['user', 'assistant', 'system'] as const;

export const createChatSchema = Joi.object<CreateChatDTO>({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.empty': 'Content is required',
    'string.max': 'Content must not exceed 2000 characters',
    'any.required': 'Content is required'
  }),
  sessionId: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Session ID is required',
    'string.max': 'Session ID must not exceed 100 characters',
    'any.required': 'Session ID is required'
  }),
  userId: Joi.string().max(100).optional().messages({
    'string.max': 'User ID must not exceed 100 characters'
  }),
  messageType: Joi.string().valid(...messageTypeValues).optional().default('user').messages({
    'any.only': 'Message type must be one of: user, assistant, system'
  }),
  priority: Joi.string().valid(...priorityValues).optional().default('medium').messages({
    'any.only': 'Priority must be one of: low, medium, high'
  })
});

export const updateChatSchema = Joi.object<UpdateChatDTO>({
  content: Joi.string().trim().min(1).max(2000).optional().messages({
    'string.empty': 'Content cannot be empty',
    'string.max': 'Content must not exceed 2000 characters'
  }),
  sessionId: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'Session ID cannot be empty',
    'string.max': 'Session ID must not exceed 100 characters'
  }),
  userId: Joi.string().max(100).optional().messages({
    'string.max': 'User ID must not exceed 100 characters'
  }),
  messageType: Joi.string().valid(...messageTypeValues).optional().messages({
    'any.only': 'Message type must be one of: user, assistant, system'
  }),
  priority: Joi.string().valid(...priorityValues).optional().messages({
    'any.only': 'Priority must be one of: low, medium, high'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const chatFiltersSchema = Joi.object<ChatFilters>({
  sessionId: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'Session ID cannot be empty',
    'string.max': 'Session ID must not exceed 100 characters'
  }),
  userId: Joi.string().max(100).optional().messages({
    'string.max': 'User ID must not exceed 100 characters'
  }),
  messageType: Joi.string().valid(...messageTypeValues).optional().messages({
    'any.only': 'Message type must be one of: user, assistant, system'
  }),
  priority: Joi.string().valid(...priorityValues).optional().messages({
    'any.only': 'Priority must be one of: low, medium, high'
  }),
  limit: Joi.number().integer().min(0).max(100).optional().default(100).messages({
    'number.min': 'Limit must be non-negative',
    'number.max': 'Limit must not exceed 100',
    'number.integer': 'Limit must be an integer'
  }),
  offset: Joi.number().integer().min(0).optional().default(0).messages({
    'number.min': 'Offset must be non-negative',
    'number.integer': 'Offset must be an integer'
  })
});

export const chatIdSchema = Joi.object({
  id: Joi.string().trim().min(1).required().messages({
    'string.empty': 'Chat ID is required',
    'any.required': 'Chat ID is required'
  })
});