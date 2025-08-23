# Chat Session Management Builder - API Specification

## API Overview

The Chat Session Management Builder backend API provides secure server-side provisioning capabilities for creating chat session management systems in Notion and Airtable.

## Base Configuration

### Base URL
```
Development: http://localhost:8787
Production: https://api.chat-session-builder.com
```

### Headers
```http
Content-Type: application/json
Accept: application/json
```

### CORS Configuration
```javascript
{
  origin: ['http://localhost:5173', 'https://chat-session-builder.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400
}
```

## Endpoints

### 1. Health Check

#### GET /health
Verify API server status and availability.

**Request:**
```http
GET /health HTTP/1.1
Host: localhost:8787
```

**Response:**
```json
{
  "ok": true,
  "timestamp": "2024-08-22T10:00:00Z",
  "version": "2.0.0"
}
```

**Status Codes:**
- `200 OK`: Server is healthy
- `503 Service Unavailable`: Server is down

---

### 2. Provision Notion Database

#### POST /api/provision/notion
Create a new Notion database with configured properties based on user selections.

**Request:**
```json
{
  "parentPageId": "abc123def456...",
  "config": {
    "platform": "notion",
    "priorities": ["organization", "analytics"],
    "features": ["projects", "tags", "dashboard"],
    "teamSize": "2-5 people",
    "complexity": "moderate"
  }
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| parentPageId | string | Yes | 32-character Notion page ID |
| config | object | Yes | User configuration object |
| config.platform | string | Yes | Must be "notion" |
| config.priorities | array | Yes | Array of priority IDs |
| config.features | array | Yes | Array of feature IDs |
| config.teamSize | string | Yes | Team size selection |
| config.complexity | string | Yes | Complexity level |

**Response (Success):**
```json
{
  "url": "https://notion.so/workspace/abc123...",
  "id": "database-id-123",
  "properties": {
    "Title": "title",
    "Platform": "select",
    "Status": "select",
    "Created": "created_time",
    "Updated": "last_edited_time",
    "Project": "relation",
    "Tags": "multi_select",
    "Priority": "select",
    "Duration": "number",
    "MessageCount": "number",
    "Satisfaction": "select",
    "ValueRating": "select"
  },
  "views": [
    "All Sessions",
    "Recent",
    "Active",
    "By Topic",
    "By Project"
  ]
}
```

**Response (Error):**
```json
{
  "error": "Notion integration not found or lacks permissions",
  "code": "NOTION_PERMISSION_ERROR",
  "details": "Ensure the integration is added to the parent page"
}
```

**Status Codes:**
- `200 OK`: Database created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Invalid Notion token
- `403 Forbidden`: Insufficient permissions
- `500 Internal Server Error`: Server configuration error

**Database Properties Created:**

Based on configuration, the following properties are created:

| Property | Type | Condition |
|----------|------|-----------|
| Title | Title | Always |
| Platform | Select | Always |
| Status | Select | Always |
| Created | Created Time | Always |
| Updated | Last Edited Time | Always |
| Primary Topic | Select | If organization in priorities |
| Secondary Topics | Multi-select | If organization in priorities |
| Category | Select | If organization in priorities |
| Project | Relation | If projects in features |
| Project Phase | Select | If projects in features |
| Tags | Multi-select | If tags in features |
| Priority | Select | If tags in features |
| Duration | Number | If analytics in priorities |
| Message Count | Number | If analytics in priorities |
| Satisfaction | Select | If analytics in priorities |
| Value Rating | Select | If analytics in priorities |
| Summary | Text | Always |
| Key Insights | Text | Always |
| Action Items | Text | Always |
| Follow-up Date | Date | Always |
| Notes | Text | Always |

---

### 3. Provision Airtable Base

#### POST /api/provision/airtable
Validate access to an existing Airtable base and optionally seed sample data.

**Request:**
```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "seedSample": true,
  "config": {
    "platform": "airtable",
    "priorities": ["search", "collaboration"],
    "features": ["exports", "reminders"],
    "teamSize": "6-20 people",
    "complexity": "advanced"
  }
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| baseId | string | Yes | Airtable base ID (app...) |
| seedSample | boolean | No | Create sample record (default: false) |
| config | object | No | User configuration for future use |

**Response (Success):**
```json
{
  "url": "https://airtable.com/appXXXXXXXXXXXXXX",
  "table": "Chat Sessions",
  "sampleRecordId": "recXXXXXXXXXXXXXX",
  "fields": [
    "Title",
    "Date",
    "Platform",
    "Status",
    "Summary",
    "Rating"
  ],
  "recordCount": 1
}
```

**Response (Error):**
```json
{
  "error": "Table 'Chat Sessions' not found in base",
  "code": "AIRTABLE_TABLE_NOT_FOUND",
  "details": "Please create a table named 'Chat Sessions' in your base"
}
```

**Status Codes:**
- `200 OK`: Base validated/seeded successfully
- `400 Bad Request`: Invalid base ID or missing table
- `401 Unauthorized`: Invalid Airtable token
- `404 Not Found`: Base or table not found
- `500 Internal Server Error`: Server configuration error

**Required Table Structure:**

The Airtable base must have a table named "Chat Sessions" with these fields:

| Field Name | Field Type | Required |
|------------|------------|----------|
| Title | Single line text | Yes |
| Date | Date | Yes |
| Platform | Single select | Yes |
| Status | Single select | Yes |
| Summary | Long text | No |
| Rating | Number/Rating | No |

---

## Error Handling

### Error Response Format
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": "Additional context or troubleshooting steps",
  "timestamp": "2024-08-22T10:00:00Z"
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| MISSING_TOKEN | Server token not configured | Contact administrator |
| INVALID_PARENT_PAGE | Notion page not found | Verify page ID |
| PERMISSION_DENIED | Integration lacks access | Add integration to page |
| TABLE_NOT_FOUND | Airtable table missing | Create required table |
| RATE_LIMIT_EXCEEDED | Too many requests | Wait and retry |
| INVALID_CONFIG | Malformed configuration | Check request format |

---

## Authentication

### Server-Side Authentication
The API uses server-side environment variables for third-party service authentication:

```bash
NOTION_TOKEN=secret_xxx...
AIRTABLE_TOKEN=pat_xxx...
```

**Important:** Client applications never send or receive these tokens.

---

## Rate Limiting

### Limits
- 60 requests per minute per IP
- 1000 requests per hour per IP
- 10 concurrent database creations

### Rate Limit Headers
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1692700800
```

---

## Webhooks (Future)

### Webhook Events
```json
{
  "event": "database.created",
  "timestamp": "2024-08-22T10:00:00Z",
  "data": {
    "platform": "notion",
    "databaseId": "xxx",
    "userId": "user123"
  }
}
```

### Planned Events
- `database.created`
- `database.updated`
- `provisioning.failed`
- `user.signup`

---

## SDK Examples

### JavaScript/TypeScript
```typescript
class ChatSessionAPI {
  private baseURL: string;
  
  constructor(baseURL = 'http://localhost:8787') {
    this.baseURL = baseURL;
  }
  
  async provisionNotion(parentPageId: string, config: Config) {
    const response = await fetch(`${this.baseURL}/api/provision/notion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentPageId, config })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Provisioning failed');
    }
    
    return response.json();
  }
  
  async provisionAirtable(baseId: string, seedSample = false) {
    const response = await fetch(`${this.baseURL}/api/provision/airtable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseId, seedSample })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Provisioning failed');
    }
    
    return response.json();
  }
}
```

### cURL Examples

**Provision Notion:**
```bash
curl -X POST http://localhost:8787/api/provision/notion \
  -H "Content-Type: application/json" \
  -d '{
    "parentPageId": "abc123def456",
    "config": {
      "platform": "notion",
      "priorities": ["organization"],
      "features": ["projects"],
      "teamSize": "Just me",
      "complexity": "simple"
    }
  }'
```

**Provision Airtable:**
```bash
curl -X POST http://localhost:8787/api/provision/airtable \
  -H "Content-Type: application/json" \
  -d '{
    "baseId": "appXXXXXXXXXXXXXX",
    "seedSample": true
  }'
```

---

## Testing

### Test Endpoints
```
Development: http://localhost:8787/api/test
Staging: https://staging-api.chat-session-builder.com/api/test
```

### Test Credentials
For development testing, use these mock IDs:
- Notion Parent Page: `test123456789012345678901234567890`
- Airtable Base: `appTEST123456789`

---

## Versioning

### API Version
Current version: `v2`

### Version Header
```http
X-API-Version: 2.0.0
```

### Deprecation Policy
- 6-month deprecation notice
- Sunset headers in responses
- Migration guides provided

---

## Security Considerations

### Best Practices
1. Never expose integration tokens to clients
2. Validate all input parameters
3. Implement request signing for production
4. Use HTTPS in production
5. Implement rate limiting
6. Log security events
7. Regular security audits

### OWASP Compliance
- Input validation (A03:2021)
- Authentication (A07:2021)
- Security logging (A09:2021)
- Server-side validation (A04:2021)

---

## Monitoring

### Health Metrics
- Response time < 500ms (p95)
- Success rate > 99.9%
- Error rate < 0.1%

### Logging
```json
{
  "timestamp": "2024-08-22T10:00:00Z",
  "level": "info",
  "endpoint": "/api/provision/notion",
  "method": "POST",
  "status": 200,
  "duration": 234,
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

---

## Support

### Contact
- API Support: api-support@chat-session-builder.com
- Security Issues: security@chat-session-builder.com
- Documentation: https://docs.chat-session-builder.com

### SLA
- Uptime: 99.9%
- Response time: < 24 hours for critical issues
- Planned maintenance: Sundays 02:00-04:00 UTC