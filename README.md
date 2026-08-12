<h1>Friend Of God </H1>
# Attendance System Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
    POST /api/users                    POST /api/auth/login
       Attendance                            Admin
              │                                 │
              │                                 ▼
              │                              JWT Token
              │                                 │
              │                                 ▼
              │                       GET /api/users
              │                       Authorization: Bearer
              │                                 │
              └──────────────┬──────────────────┘
                             ▼
                    ┌─────────────────┐
                    │     Express     │
                    │     Backend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     NeonDB      │
                    │                 │
                    │ users           │
                    │ admins          │
                    └─────────────────┘

API Endpoints

Method	Endpoint	Purpose	Authentication

POST	/api/users	Submit attendance	Public
POST	/api/auth/login	Admin login	Public
GET	/api/users	Get all attendance records	JWT Required


Flow

1. React App → POST /api/users

Attendee submits their:

Name

Contact

Hostel

Invited by

Member status


Express validates and stores the attendance in NeonDB.



2. React Admin → POST /api/auth/login

Admin submits username and password.

Express verifies the credentials.

A JWT token is returned.



3. React Admin → GET /api/users

Admin sends the JWT using: Authorization: Bearer <token>

Express verifies the token.

If valid, attendance records are retrieved from NeonDB.



4. NeonDB

users → attendance records.

admins → administrator credentials.




Database

NeonDB
│
├── users
│   ├── id
│   ├── name
│   ├── contact
│   ├── hostel
│   ├── invited_by
│   ├── member
│   └── created_at
│
└── admins
    ├── id
    ├── username
    ├── password
    └── created_at

:::
