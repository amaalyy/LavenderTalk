# LavenderTalk

>An interactive real-time chat platform powered by web technologies.
>
## Features

- User authentication (signup, login, logout)

- Real-time messaging with Socket.IO

- Secure JWT-based authentication

- Profile management

- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **Real-time Communication:** Socket.IO
- **Storage:** Cloudinary (for media uploads)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/chat-app.git
cd chat-app
```

2. Install dependencies for both frontend and backend:

```sh
cd backend
npm install
cd ../frontend
npm install
```

3. Configure environment variables:

Create a `.env` file in the `backend` directory and add:

```sh
MONGO_URI=your_mongo_db_connection_string
PORT=your_port
JWT_SECRET=your_secret_key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=dvmuaxoak
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:

```sh
cd backend
nodemon server.js
```

5. Start the frontend:

```sh
cd frontend
npm run dev
```

## Usage

- Sign up or log in to start chatting.

- Send and receive real-time messages.

- Update your profile pic.

## Authors

- [@amaalyy](https://github.com/amaalyy)
