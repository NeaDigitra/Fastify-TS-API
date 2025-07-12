# API Usage Examples

This document provides comprehensive examples of how to use the Fastify TypeScript API.

## 🚀 Getting Started

### Base URL

```
http://localhost:3000/api/v1
```

### Authentication

Currently, the API does not require authentication. This is perfect for development and can be easily extended with JWT or other auth mechanisms.

---

## 🏥 Health Check Endpoints

### Basic Health Check

**Request:**

```bash
curl -X GET http://localhost:3000/api/v1/health
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-07-12T02:30:45.123Z"
  },
  "timestamp": "2025-07-12T02:30:45.123Z"
}
```

### Readiness Check

**Request:**

```bash
curl -X GET http://localhost:3000/api/v1/health/ready
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "ready",
    "services": {
      "database": "connected",
      "memory": "optimal"
    },
    "timestamp": "2025-07-12T02:30:45.123Z"
  },
  "timestamp": "2025-07-12T02:30:45.123Z"
}
```

---

## 👥 User Management

### 1. List All Users

**Request:**

```bash
curl -X GET http://localhost:3000/api/v1/users
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-07-12T02:30:45.123Z",
      "updatedAt": "2025-07-12T02:30:45.123Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2025-07-12T02:30:45.123Z",
      "updatedAt": "2025-07-12T02:30:45.123Z"
    }
  ],
  "timestamp": "2025-07-12T02:30:45.123Z"
}
```

### 2. List Users with Pagination

**Request:**

```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=2"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2025-07-12T02:30:45.123Z",
        "updatedAt": "2025-07-12T02:30:45.123Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 2,
      "total": 4,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2025-07-12T02:30:45.123Z"
}
```

### 3. Get User by ID

**Request:**

```bash
curl -X GET http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-07-12T02:30:45.123Z",
    "updatedAt": "2025-07-12T02:30:45.123Z"
  },
  "timestamp": "2025-07-12T02:30:45.123Z"
}
```

### 4. Create New User

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2025-07-12T02:30:45.123Z",
    "updatedAt": "2025-07-12T02:30:45.123Z"
  },
  "timestamp": "2025-07-12T02:30:45.123Z"
}
```

### 5. Update User

**Request:**

```bash
curl -X PUT http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "createdAt": "2025-07-12T02:30:45.123Z",
    "updatedAt": "2025-07-12T02:31:15.456Z"
  },
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

### 6. Delete User

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/v1/users/550e8400-e29b-41d4-a716-446655440000
```

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  },
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

---

## ❌ Error Responses

### Validation Error (400)

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email"
  }'
```

**Response:**

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "body/name must NOT have fewer than 1 characters",
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

### User Not Found (404)

**Request:**

```bash
curl -X GET http://localhost:3000/api/v1/users/non-existent-id
```

**Response:**

```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "User with id non-existent-id not found",
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

### Duplicate Email (409)

**Request:**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another User",
    "email": "existing@example.com"
  }'
```

**Response:**

```json
{
  "success": false,
  "error": "DUPLICATE_RESOURCE",
  "message": "User with this email already exists",
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

### Rate Limit Exceeded (429)

**Response:**

```json
{
  "success": false,
  "error": "RATE_LIMITED",
  "message": "Rate limit exceeded",
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

---

## 🔧 Using with Different HTTP Clients

### JavaScript/Fetch

```javascript
// Get all users
const response = await fetch('http://localhost:3000/api/v1/users');
const data = await response.json();
console.log(data);

// Create user
const newUser = await fetch('http://localhost:3000/api/v1/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Bob Wilson',
    email: 'bob@example.com',
  }),
});
const userData = await newUser.json();
console.log(userData);
```

### Python/Requests

```python
import requests

# Get all users
response = requests.get('http://localhost:3000/api/v1/users')
data = response.json()
print(data)

# Create user
new_user = requests.post(
    'http://localhost:3000/api/v1/users',
    json={
        'name': 'Bob Wilson',
        'email': 'bob@example.com'
    }
)
user_data = new_user.json()
print(user_data)
```

### Node.js/Axios

```javascript
const axios = require('axios');

// Get all users
async function getUsers() {
  try {
    const response = await axios.get('http://localhost:3000/api/v1/users');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Create user
async function createUser() {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/users', {
      name: 'Bob Wilson',
      email: 'bob@example.com',
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

---

## 📊 Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "data": {}, // or []
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

### Error Response

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "users": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "timestamp": "2025-07-12T02:31:15.456Z"
}
```

---

## 🎯 Query Parameters

### Pagination

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

**Example:**

```
GET /api/v1/users?page=2&limit=5
```

---

## 📈 Status Codes

| Code | Description                                |
| ---- | ------------------------------------------ |
| 200  | OK - Request successful                    |
| 201  | Created - Resource created successfully    |
| 204  | No Content - Resource deleted successfully |
| 400  | Bad Request - Invalid input data           |
| 404  | Not Found - Resource not found             |
| 409  | Conflict - Resource already exists         |
| 429  | Too Many Requests - Rate limit exceeded    |
| 500  | Internal Server Error - Server error       |

---

## 🧪 Testing with Postman

You can import the API into Postman:

1. Start the server: `npm run dev`
2. Visit: `http://localhost:3000/docs/json`
3. Copy the OpenAPI JSON
4. In Postman: Import → Raw Text → Paste the JSON

This will create a complete Postman collection with all endpoints and examples.

---

## 💡 Tips for API Usage

1. **Always check the `success` field** in responses
2. **Handle pagination** for list endpoints
3. **Use proper error handling** for different status codes
4. **Respect rate limits** (100 requests per minute by default)
5. **Validate data** before sending requests
6. **Use the OpenAPI documentation** at `/docs` for interactive testing

---

For more detailed information, visit the interactive API documentation at `http://localhost:3000/docs` when the server is running.
