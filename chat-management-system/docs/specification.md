# Chat Management System API Specification

## Overview
A RESTful API for managing chat sessions with an in-memory data store. The API provides CRUD operations for chat sessions with proper error handling and validation.

## Data Model

### Chat Session
```javascript
{
  id: string,          // Unique identifier (UUID)
  title: string,       // Required, max 200 chars
  description: string, // Optional, max 1000 chars
  active: boolean,     // Default: true
  priority: string,    // Enum: 'low', 'medium', 'high', default: 'medium'
  userId: string,      // Optional, user identifier
  createdAt: Date,     // ISO timestamp
  updatedAt: Date      // ISO timestamp
}
```

## API Endpoints

### 1. GET /chats
Retrieve all chat sessions with optional filtering

**Query Parameters:**
- `active` (boolean): Filter by session status
- `priority` (string): Filter by priority level
- `limit` (number): Limit results (default: 100)
- `offset` (number): Pagination offset (default: 0)

**Response:**
- 200 OK: Array of chat sessions
```json
{
  "chats": [...],
  "total": number,
  "limit": number,
  "offset": number
}
```

### 2. GET /chats/:id
Retrieve a single chat session by ID

**Response:**
- 200 OK: Chat session object
- 404 Not Found: If chat session doesn't exist

### 3. POST /chats
Create a new chat session

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "low|medium|high (optional)"
}
```

**Response:**
- 201 Created: New chat session with generated ID
- 400 Bad Request: Invalid input

### 4. PUT /chats/:id
Update an existing chat session

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "active": "boolean (optional)",
  "priority": "low|medium|high (optional)"
}
```

**Response:**
- 200 OK: Updated chat session
- 404 Not Found: If chat session doesn't exist
- 400 Bad Request: Invalid input

### 5. DELETE /chats/:id
Delete a chat session

**Response:**
- 204 No Content: Successfully deleted
- 404 Not Found: If chat session doesn't exist

### 6. POST /chats/:id/toggle
Toggle status of a chat session

**Response:**
- 200 OK: Updated chat session
- 404 Not Found: If chat session doesn't exist

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional details
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## In-Memory Store Requirements

1. **Thread-Safe Operations**: All operations must be thread-safe
2. **Data Persistence**: Store exists only in memory (no persistence)
3. **Indexing**: Maintain indexes for fast lookup by ID
4. **Validation**: Validate all inputs before storage
5. **Atomic Operations**: Ensure CRUD operations are atomic

## Non-Functional Requirements

1. **Performance**: 
   - Response time < 100ms for all operations
   - Support up to 10,000 chat sessions in memory

2. **Scalability**:
   - Modular design for easy extension
   - Clean separation of concerns

3. **Security**:
   - Input sanitization
   - No SQL injection vulnerabilities
   - Rate limiting consideration

4. **Code Quality**:
   - Files < 500 lines
   - Comprehensive error handling
   - Well-documented code