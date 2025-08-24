# Chat Management System API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. Future versions will support JWT tokens.

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per IP

## API Endpoints

### 1. List All Chat Sessions

**Endpoint:** `GET /chats`

**Description:** Retrieve a paginated list of all chat sessions with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| active | boolean | No | - | Filter by session status |
| priority | string | No | - | Filter by priority (low, medium, high) |
| limit | number | No | 100 | Number of items per page (max: 100) |
| offset | number | No | 0 | Pagination offset |

**Response Example:**
```json
{
  "chats": [
    {
      "id": "chat_1_1234567890",
      "title": "Team Project Discussion",
      "description": "Discussing project requirements and timeline",
      "active": true,
      "priority": "high",
      "userId": "user_123",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}
```

**Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server error

---

### 2. Get Single Chat Session

**Endpoint:** `GET /chats/:id`

**Description:** Retrieve a single chat session by its ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Chat session ID |

**Response Example:**
```json
{
  "id": "chat_1_1234567890",
  "title": "Team Project Discussion",
  "description": "Discussing project requirements and timeline",
  "active": true,
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Chat session not found
- `500 Internal Server Error` - Server error

---

### 3. Create Chat Session

**Endpoint:** `POST /chats`

**Description:** Create a new chat session.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "priority": "high"
}
```

**Body Parameters:**
| Parameter | Type | Required | Constraints | Default |
|-----------|------|----------|-------------|---------|
| title | string | Yes | Max 200 chars | - |
| description | string | No | Max 1000 chars | "" |
| priority | string | No | low, medium, high | "medium" |

**Response Example:**
```json
{
  "id": "chat_1_1234567890",
  "title": "Team Project Discussion",
  "description": "Discussing project requirements and timeline",
  "active": true,
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `201 Created` - Chat session created successfully
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

---

### 4. Update Chat Session

**Endpoint:** `PUT /chats/:id`

**Description:** Update an existing chat session.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Chat session ID |

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "active": false,
  "priority": "low"
}
```

**Body Parameters:**
| Parameter | Type | Required | Constraints |
|-----------|------|----------|-------------|
| title | string | No | Max 200 chars |
| description | string | No | Max 1000 chars |
| active | boolean | No | true or false |
| priority | string | No | low, medium, high |

**Response Example:**
```json
{
  "id": "chat_1_1234567890",
  "title": "Updated title",
  "description": "Updated description",
  "active": false,
  "priority": "low",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:45:00Z"
}
```

**Status Codes:**
- `200 OK` - Chat session updated successfully
- `400 Bad Request` - Invalid input
- `404 Not Found` - Chat session not found
- `500 Internal Server Error` - Server error

---

### 5. Delete Chat Session

**Endpoint:** `DELETE /chats/:id`

**Description:** Delete a chat session.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Chat session ID |

**Response:** No content

**Status Codes:**
- `204 No Content` - Chat session deleted successfully
- `404 Not Found` - Chat session not found
- `500 Internal Server Error` - Server error

---

### 6. Toggle Chat Session Status

**Endpoint:** `POST /chats/:id/toggle`

**Description:** Toggle the status of a chat session.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Chat session ID |

**Response Example:**
```json
{
  "id": "chat_1_1234567890",
  "title": "Team Project Discussion",
  "description": "Discussing project requirements and timeline",
  "active": false,
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T15:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Session status toggled
- `404 Not Found` - Chat session not found
- `500 Internal Server Error` - Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| NOT_FOUND | Resource not found |
| INTERNAL_ERROR | Server error occurred |

---

## Example Usage

### cURL Examples

**Create a chat session:**
```bash
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Standup",
    "description": "Daily team standup meeting",
    "priority": "high",
    "userId": "user_123"
  }'
```

**Get all chat sessions:**
```bash
curl http://localhost:3000/api/chats?active=true&limit=10
```

**Update a chat session:**
```bash
curl -X PUT http://localhost:3000/api/chats/chat_1_1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "active": false
  }'
```

**Delete a chat session:**
```bash
curl -X DELETE http://localhost:3000/api/chats/chat_1_1234567890
```

### JavaScript Examples

```javascript
// Create a chat session
const response = await fetch('http://localhost:3000/api/chats', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Team Standup',
    description: 'Daily team standup meeting',
    priority: 'high',
    userId: 'user_123'
  })
});
const newChat = await response.json();

// Get all active chat sessions
const chats = await fetch('http://localhost:3000/api/chats?active=true')
  .then(res => res.json());

// Toggle session status
const toggled = await fetch(`http://localhost:3000/api/chats/${chatId}/toggle`, {
  method: 'POST'
}).then(res => res.json());
```

---

## Performance Guidelines

1. **Pagination**: Always use pagination for list operations
2. **Filtering**: Use query parameters to reduce payload size
3. **Caching**: Responses include ETag headers for client-side caching
4. **Batch Operations**: Future versions will support batch create/update/delete

---

## Versioning

The API uses URL versioning. Current version: v1

Future versions will be available at:
- `/api/v2/chats`
- `/api/v3/chats`

---

## Support

For issues or questions:
- GitHub Issues: [chat-management-system/issues](https://github.com/example/chat-management-system/issues)
- Email: api-support@example.com