# FFMen Backend Service

This is the backend service for the **FFMen** project, built using **Node.js**, **Express**, **TypeScript**, and **MongoDB** with **Mongoose**.

## ✨ Features

- ✅ User Registration & Login with hashed passwords
- ✅ JWT authentication (token-based)
- ✅ Send Welcome Emails via Resend + React Email
- ✅ OTP verification via Email or WhatsApp
- ✅ Phone number normalization (Vietnam format `+84`)
- ✅ Role-based access control (admin, staff, customer)
- ✅ MongoDB using Mongoose
- ✅ TypeScript for type safety
- ✅ CORS enabled for frontend communication

## 📦 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **bcryptjs** for password hashing
- **Resend** + **@react-email** for emails
- **JWT** for authentication
- **dotenv** for env config

## 📂 Project Structure

```
.
├── src/
│   ├── config/           # MongoDB config
│   ├── controllers/      # Route logic (Register, Login, OTP)
│   ├── emails/           # React Email components
│   ├── middleware/       # Middleware (auth, error)
│   ├── routes/           # Express routers
│   ├── types/            # Type definitions (user model)
│   ├── utils/            # Utility functions (token, otp)
│   └── index.ts          # Server entry point
├── .env
├── tsconfig.json
└── package.json
```

## ⚙️ Getting Started

### 1. Clone repo

```bash
git clone https://github.com/yourname/ffmen-backend.git
cd ffmen-backend
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Create `.env` file

```env
# Port on which the application will run
# Change this if you want to run the app on a different port
PORT=5000

# Environment variables for the Becky application
JWT_EXPIRES_IN= 1d
JWT_SECRET=...

# MongoDB connection string for the brand database
DATABASE_URL=...


# Cloudinary configuration for image uploads
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Twilio configuration for WhatsApp messaging
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Resend API key for email verification
RESEND_API_KEY=...

```

### 4. Start development server

```bash
pnpm dev
# or
npm run dev
```

## 🧰 API Endpoints

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/api/auth/register`   | Register new user       |
| POST   | `/api/auth/login`      | Login with email/pass   |
| POST   | `/api/auth/logout`     | Clear cookie + logout   |
| POST   | `/api/auth/resend-otp` | Send OTP to email/phone |
| POST   | `/api/auth/verify-otp` | Verify submitted OTP    |

## 📧 Email Template

Email content is built using [`@react-email/components`](https://react.email/) and sent via [Resend](https://resend.com/).

## 🛡️ Security Notes

- Passwords are hashed before storing using `bcryptjs`.
- Token is stored in `HttpOnly` cookie (recommended for web apps).
- CORS is configured to allow requests from frontend.

## 👨‍💻 Author

---

