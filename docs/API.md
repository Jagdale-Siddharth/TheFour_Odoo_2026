# TransitOps API Documentation — Member 1 Module

Base URL: `http://localhost:5000/api`

## Auth

### POST /auth/register
Body: `{ "name": "", "email": "", "password": "", "role": "FLEET_MANAGER" }`
Success 201: `{ success:true, message:"User registered successfully", data:{ token, user } }`

### POST /auth/login
Body: `{ "email": "", "password": "" }`
Success 200: `{ success:true, message:"Login successful", data:{ token, user } }`

### POST /auth/logout
Header: `Authorization: Bearer <token>`

### GET /auth/me
Header: `Authorization: Bearer <token>`

## Users

### GET /users?page=1&limit=20
Requires FLEET_MANAGER role.

### GET /users/:id
Requires valid token.

### PUT /users/:id
Requires FLEET_MANAGER role. Body: any of `{ name, role, status }`

### DELETE /users/:id
Requires FLEET_MANAGER role.
