# 🚑 RAHAT – Smart Emergency Response Platform

RAHAT is a full-stack **MERN** application designed to simplify emergency healthcare access by connecting users with nearby hospitals, blood banks, pharmacies, and emergency contacts. The platform features secure authentication, real-time SOS communication, and a responsive user experience to ensure quick access to critical services.

---

## ✨ Features

- 🔐 Secure Authentication using **JWT**, **bcrypt**, and **Express Sessions**
- 🏥 Hospital Locator
- 🩸 Blood Bank Directory
- 💊 Pharmacy Locator
- 🚨 Real-time SOS Alert System
- 📞 Emergency Contacts Management
- 👤 Medical Profile Management
- ☁️ Image Uploads using Cloudinary
- 📡 Real-time communication with **Socket.io**
- 📱 Fully Responsive UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Express Session
- Socket.io
- Cloudinary
- Nodemailer

---

## 📂 Project Structure

```text
RAHAT/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   ├── utils/
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/Mehak1314/rahat-emergency-response-platform.git
cd rahat-emergency-response-platform
```

### Install Dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

## ▶️ Run Locally

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

---

## 🚀 Future Enhancements

- 📍 Google Maps Integration
- 🚑 Live Ambulance Tracking
- 🔔 Push Notifications
- 🤖 AI-based Emergency Assistance
- 📅 Doctor Appointment Booking
- 🌐 Multi-language Support

---

## 👩‍💻 Author

**Mehak Garg**

- GitHub: https://github.com/Mehak1314

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub!
