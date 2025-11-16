# LinkChat Backend

LinkChat is a social networking platform backend built with Node.js, Express, and MongoDB. It allows users to connect with each other, send connection requests, and communicate through a chat system.


## Features

- User authentication (signup, login, logout)
- User profile management (view, edit)
- Connection requests (send, accept, reject)
- User feed with suggested connections
- Chat functionality between connected users
- Email notifications using AWS SES
- Scheduled tasks with node-cron
- JWT-based authentication
- MongoDB database with Mongoose ODM

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Email Service**: AWS SES (Simple Email Service)
- **Real-time Communication**: Socket.IO
- **Validation**: validator.js
- **Task Scheduling**: node-cron
- **Date Handling**: date-fns

## API Endpoints

### Auth Routes
- `POST /signup` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Profile Routes
- `GET /profile/view` - View user profile
- `PATCH /profile/edit` - Edit user profile

### Connection Request Routes
- `POST /request/send/:status/:toUserId` - Send connection request (status: interested/ignored)
- `POST /request/review/:status/:requestId` - Review connection request (status: accepted/rejected)

### User Routes
- `GET /user/requests/received` - Get received connection requests
- `GET /user/connections` - Get accepted connections
- `GET /user/feed` - Get user feed with suggested connections

### Chat Routes
- `GET /chat/:targetUserId` - Get chat with a specific user
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/linkchat-backend.git
