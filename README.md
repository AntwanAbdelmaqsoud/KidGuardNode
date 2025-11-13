# AUTH

POST /api/auth/register
POST /api/auth/login
GET /api/auth/google
GET /api/auth/google/callback
POST /api/auth/logout

# USER

GET /api/users/me
PUT /api/users/me
DELETE /api/users/me

# PARENT–CHILD

POST /api/parent-child/code/generate
POST /api/parent-child/code/verify
DELETE /api/parent-child/link/:id
GET /api/parent-child/children

# ALLOWED ZONES

POST /api/allowed-zones
GET /api/allowed-zones/:childId
DELETE /api/allowed-zones/:zoneId

# COLLECTED DATA

POST /api/collected-data
GET /api/collected-data/:id/audio
GET /api/collected-data/:childId
