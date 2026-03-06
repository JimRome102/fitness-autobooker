# FitBook Auto - API Documentation

## Base URL

```
Production: https://fitness-autobooker-api.onrender.com
Development: http://localhost:3001
```

## Authentication

All API endpoints (except `/health`) require authentication via JWT tokens in the Authorization header.

```
Authorization: Bearer <jwt_token>
```

**Note**: In MVP version, authentication is simplified. Full JWT implementation in Phase 2.

---

## API Endpoints

### Health Check

#### GET `/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-06T12:00:00.000Z",
  "uptime": 123456
}
```

---

## Credentials API

### Create Credential

#### POST `/api/credentials`

Add platform login credentials (encrypted).

**Request Body:**
```json
{
  "platform": "classpass",
  "username": "user@example.com",
  "password": "securepassword123"
}
```

**Validation:**
- `platform`: Required, one of: classpass, mindbody, barrys, slt, y7
- `username`: Required, valid email or username
- `password`: Required, minimum 8 characters

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user-id-123",
    "platform": "classpass",
    "username": "user@example.com",
    "isActive": true,
    "createdAt": "2026-03-06T12:00:00.000Z",
    "updatedAt": "2026-03-06T12:00:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid platform",
    "details": {
      "field": "platform",
      "issue": "Must be one of: classpass, mindbody, barrys, slt, y7"
    }
  }
}
```

409 Conflict:
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_CREDENTIAL",
    "message": "Credentials for this platform already exist"
  }
}
```

---

### Get All Credentials

#### GET `/api/credentials`

Retrieve all stored credentials for the authenticated user.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "platform": "classpass",
      "username": "user@example.com",
      "isActive": true,
      "lastTested": "2026-03-05T10:00:00.000Z",
      "createdAt": "2026-03-01T12:00:00.000Z",
      "updatedAt": "2026-03-05T10:00:00.000Z"
    },
    {
      "id": "456e7890-e89b-12d3-a456-426614174111",
      "platform": "barrys",
      "username": "user@example.com",
      "isActive": true,
      "lastTested": null,
      "createdAt": "2026-03-02T12:00:00.000Z",
      "updatedAt": "2026-03-02T12:00:00.000Z"
    }
  ]
}
```

**Note**: Passwords are never returned in responses.

---

### Update Credential

#### PUT `/api/credentials/:id`

Update existing credentials.

**Request Body:**
```json
{
  "username": "newemail@example.com",
  "password": "newsecurepassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "platform": "classpass",
    "username": "newemail@example.com",
    "isActive": true,
    "updatedAt": "2026-03-06T12:30:00.000Z"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "error": {
    "code": "CREDENTIAL_NOT_FOUND",
    "message": "Credential not found"
  }
}
```

---

### Delete Credential

#### DELETE `/api/credentials/:id`

Delete stored credentials.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Credential deleted successfully"
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "error": {
    "code": "CREDENTIAL_NOT_FOUND",
    "message": "Credential not found"
  }
}
```

---

### Test Connection

#### POST `/api/credentials/:id/test`

Test if credentials are valid by attempting login.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "platform": "classpass",
    "connectionStatus": "success",
    "message": "Successfully logged in",
    "testedAt": "2026-03-06T12:00:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Login failed - invalid credentials",
    "platform": "classpass"
  }
}
```

---

## Booking Preferences API

### Create Booking Preference

#### POST `/api/preferences`

Add a class booking preference.

**Request Body:**
```json
{
  "platform": "barrys",
  "studioName": "Barry's Lincoln Park",
  "className": "Full Body",
  "date": "2026-04-15",
  "time": "06:00",
  "instructor": "Sarah Johnson",
  "priority": "high"
}
```

**Validation:**
- `platform`: Required, one of: classpass, mindbody, barrys, slt, y7
- `studioName`: Required, 1-255 characters
- `className`: Required, 1-255 characters
- `date`: Required, ISO 8601 date (YYYY-MM-DD), must be in the future
- `time`: Required, 24-hour format (HH:MM)
- `instructor`: Optional, 1-255 characters
- `priority`: Required, one of: high, medium, low

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174222",
    "userId": "user-id-123",
    "platform": "barrys",
    "studioName": "Barry's Lincoln Park",
    "className": "Full Body",
    "classDate": "2026-04-15",
    "classTime": "06:00:00",
    "instructor": "Sarah Johnson",
    "priority": "high",
    "isActive": true,
    "createdAt": "2026-03-06T12:00:00.000Z",
    "updatedAt": "2026-03-06T12:00:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date - must be in the future",
    "details": {
      "field": "date",
      "value": "2026-03-01"
    }
  }
}
```

---

### Get All Preferences

#### GET `/api/preferences`

Retrieve all booking preferences for the authenticated user.

**Query Parameters:**
- `active`: Boolean (optional) - Filter by active status
- `platform`: String (optional) - Filter by platform
- `date`: String (optional) - Filter by date (YYYY-MM-DD)
- `sortBy`: String (optional) - Sort field (date, priority, createdAt)
- `order`: String (optional) - Sort order (asc, desc)

**Example Request:**
```
GET /api/preferences?active=true&sortBy=priority&order=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174222",
      "platform": "barrys",
      "studioName": "Barry's Lincoln Park",
      "className": "Full Body",
      "classDate": "2026-04-15",
      "classTime": "06:00:00",
      "instructor": "Sarah Johnson",
      "priority": "high",
      "isActive": true,
      "createdAt": "2026-03-06T12:00:00.000Z"
    },
    {
      "id": "890e1234-e89b-12d3-a456-426614174333",
      "platform": "slt",
      "studioName": "SLT Loop",
      "className": "Megaformer",
      "classDate": "2026-04-16",
      "classTime": "06:00:00",
      "instructor": "Mike Chen",
      "priority": "high",
      "isActive": true,
      "createdAt": "2026-03-06T12:05:00.000Z"
    }
  ],
  "meta": {
    "total": 8,
    "returned": 2,
    "filters": {
      "active": true,
      "sortBy": "priority",
      "order": "desc"
    }
  }
}
```

---

### Get Single Preference

#### GET `/api/preferences/:id`

Retrieve a specific booking preference.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174222",
    "platform": "barrys",
    "studioName": "Barry's Lincoln Park",
    "className": "Full Body",
    "classDate": "2026-04-15",
    "classTime": "06:00:00",
    "instructor": "Sarah Johnson",
    "priority": "high",
    "isActive": true,
    "createdAt": "2026-03-06T12:00:00.000Z",
    "updatedAt": "2026-03-06T12:00:00.000Z"
  }
}
```

---

### Update Preference

#### PUT `/api/preferences/:id`

Update an existing booking preference.

**Request Body:**
```json
{
  "priority": "medium",
  "instructor": "New Instructor"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "789e0123-e89b-12d3-a456-426614174222",
    "platform": "barrys",
    "studioName": "Barry's Lincoln Park",
    "className": "Full Body",
    "classDate": "2026-04-15",
    "classTime": "06:00:00",
    "instructor": "New Instructor",
    "priority": "medium",
    "isActive": true,
    "updatedAt": "2026-03-06T13:00:00.000Z"
  }
}
```

---

### Delete Preference

#### DELETE `/api/preferences/:id`

Delete a booking preference.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Preference deleted successfully"
}
```

---

## Booking Execution API

### Trigger Booking Run

#### POST `/api/bookings/run`

Manually trigger the booking process (for testing or manual execution).

**Request Body (Optional):**
```json
{
  "dryRun": false,
  "platforms": ["classpass", "barrys"]
}
```

**Parameters:**
- `dryRun`: Boolean (default: false) - If true, simulates booking without actual execution
- `platforms`: Array (optional) - Only run for specific platforms

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "runId": "run-123e4567-e89b-12d3-a456-426614174444",
    "status": "running",
    "startedAt": "2026-03-06T12:00:00.000Z",
    "estimatedDuration": "5-10 minutes",
    "message": "Booking process started"
  }
}
```

**Note**: This is a long-running operation. Poll the status endpoint for results.

---

### Get Booking Run Status

#### GET `/api/bookings/runs/:runId`

Check the status of a booking run.

**Response (200 OK) - In Progress:**
```json
{
  "success": true,
  "data": {
    "id": "run-123e4567-e89b-12d3-a456-426614174444",
    "status": "running",
    "progress": {
      "total": 8,
      "completed": 3,
      "remaining": 5
    },
    "startedAt": "2026-03-06T12:00:00.000Z",
    "currentPlatform": "barrys"
  }
}
```

**Response (200 OK) - Completed:**
```json
{
  "success": true,
  "data": {
    "id": "run-123e4567-e89b-12d3-a456-426614174444",
    "status": "completed",
    "startedAt": "2026-03-06T12:00:00.000Z",
    "completedAt": "2026-03-06T12:04:23.000Z",
    "duration": "4m 23s",
    "results": {
      "total": 8,
      "successful": 6,
      "waitlisted": 2,
      "failed": 0
    },
    "details": [
      {
        "platform": "barrys",
        "className": "Full Body",
        "status": "booked",
        "executionTime": "1.2s"
      }
      // ... more results
    ]
  }
}
```

---

### Get Booking History

#### GET `/api/bookings/history`

Retrieve booking history with filters.

**Query Parameters:**
- `limit`: Number (default: 20) - Number of results per page
- `offset`: Number (default: 0) - Pagination offset
- `platform`: String (optional) - Filter by platform
- `result`: String (optional) - Filter by result (success, waitlisted, failed)
- `startDate`: String (optional) - Filter from date (ISO 8601)
- `endDate`: String (optional) - Filter to date (ISO 8601)

**Example Request:**
```
GET /api/bookings/history?limit=10&result=success&platform=barrys
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "hist-123e4567-e89b-12d3-a456-426614174555",
      "preferenceId": "789e0123-e89b-12d3-a456-426614174222",
      "platform": "barrys",
      "studioName": "Barry's Lincoln Park",
      "className": "Full Body",
      "classDatetime": "2026-04-15T06:00:00.000Z",
      "instructor": "Sarah Johnson",
      "result": "success",
      "executionTimeMs": 1234,
      "attemptTimestamp": "2026-03-21T00:01:23.000Z",
      "errorMessage": null
    },
    {
      "id": "hist-234e5678-e89b-12d3-a456-426614174666",
      "preferenceId": "890e1234-e89b-12d3-a456-426614174333",
      "platform": "y7",
      "studioName": "Y7 West Loop",
      "className": "Hot Yoga",
      "classDatetime": "2026-04-16T06:30:00.000Z",
      "instructor": null,
      "result": "waitlisted",
      "executionTimeMs": 2100,
      "attemptTimestamp": "2026-03-21T00:02:45.000Z",
      "errorMessage": null
    }
  ],
  "meta": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### Get All Booking Runs

#### GET `/api/bookings/runs`

Retrieve history of all booking runs.

**Query Parameters:**
- `limit`: Number (default: 10)
- `offset`: Number (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "run-123e4567-e89b-12d3-a456-426614174444",
      "scheduledTime": "2026-02-21T00:01:00.000Z",
      "actualStartTime": "2026-02-21T00:01:02.000Z",
      "endTime": "2026-02-21T00:05:25.000Z",
      "status": "completed",
      "totalAttempts": 8,
      "successfulBookings": 6,
      "waitlistedBookings": 2,
      "failedBookings": 0,
      "errorLog": null
    },
    {
      "id": "run-234e5678-e89b-12d3-a456-426614174555",
      "scheduledTime": "2026-01-21T00:01:00.000Z",
      "actualStartTime": "2026-01-21T00:01:01.000Z",
      "endTime": "2026-01-21T00:06:12.000Z",
      "status": "completed",
      "totalAttempts": 7,
      "successfulBookings": 5,
      "waitlistedBookings": 1,
      "failedBookings": 1,
      "errorLog": "ClassPass timeout after 30s"
    }
  ],
  "meta": {
    "total": 6,
    "limit": 10,
    "offset": 0
  }
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional context
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `DUPLICATE_CREDENTIAL` | 409 | Credential already exists |
| `INVALID_CREDENTIALS` | 401 | Platform login failed |
| `AUTOMATION_ERROR` | 500 | Browser automation failure |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Booking run endpoint**: 5 requests per hour per user
- **Test connection endpoint**: 10 requests per hour per credential

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1678099200
```

**Response when rate limit exceeded (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 300
  }
}
```

---

## Webhooks (Future)

Planned for Phase 2:

- `booking.run.started` - Booking process started
- `booking.run.completed` - Booking process completed
- `booking.preference.booked` - Individual class booked
- `booking.preference.waitlisted` - Added to waitlist
- `booking.preference.failed` - Booking failed

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fitness-autobooker-api.onrender.com',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Add booking preference
const addPreference = async () => {
  const response = await api.post('/api/preferences', {
    platform: 'barrys',
    studioName: "Barry's Lincoln Park",
    className: 'Full Body',
    date: '2026-04-15',
    time: '06:00',
    instructor: 'Sarah Johnson',
    priority: 'high'
  });

  return response.data;
};

// Get booking history
const getHistory = async () => {
  const response = await api.get('/api/bookings/history', {
    params: {
      limit: 20,
      result: 'success'
    }
  });

  return response.data;
};
```

---

## Testing

Use the following test credentials in development:

```
Platform: classpass
Username: test@example.com
Password: testpassword123
```

**Base URL (Development):**
```
http://localhost:3001
```

---

## Changelog

### v1.0.0 (MVP) - March 2026
- Initial API release
- Credentials management
- Booking preferences
- Manual booking execution
- Booking history

### v1.1.0 (Planned) - May 2026
- Automated scheduling
- Webhooks
- Multi-user support
- Enhanced filtering

---

## Support

For API support, please:
1. Check this documentation
2. Review [GitHub Issues](https://github.com/yourusername/fitness-autobooker/issues)
3. Contact: api-support@fitbookauto.com
