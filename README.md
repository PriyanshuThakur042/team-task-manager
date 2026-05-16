# 🚀 TaskPro - Modern Team Task Manager

TaskPro is a production-ready, full-stack Task Management application built using the **MERN Stack** (MongoDB, Express, React, Node.js). Designed for high-performance teams, it features a premium SaaS dashboard, role-based access control, and real-time analytics.

---

## ✨ Key Features

- **📊 Advanced Dashboard**: Real-time visualization of task metrics (Total, Completed, Pending, Overdue) using interactive Donut charts.
- **🔐 Secure Authentication**: JWT-based authentication with protected routes and state-persistent login.
- **🛡️ Role-Based Access Control (RBAC)**: Distinct permissions for **Admins** (Create projects, Assign tasks, Team management) and **Members** (View projects, Update task status).
- **📂 Project Management**: Organize tasks within specific projects with dedicated member assignments.
- **📝 Task Tracking**: Comprehensive task lifecycle management with priority levels (Low, Medium, High) and status tracking (Todo, In Progress, Done).
- **👤 User Profiles**: Customizable user settings with profile info updates and timezone management.
- **🎨 Premium UI/UX**: Modern, responsive interface built with Tailwind CSS, featuring glassmorphism, smooth animations, and interactive hover states.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19 (Vite)**
- **Tailwind CSS v4** (Modern utility-first styling)
- **Lucide React** (Beautiful iconography)
- **Recharts** (Data visualization)
- **Axios** (API communication)
- **Framer Motion** (Subtle micro-animations)

### **Backend**
- **Node.js & Express.js**
- **MongoDB & Mongoose** (NoSQL Database)
- **JSON Web Token (JWT)** (Secure Auth)
- **Bcrypt.js** (Password hashing)

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB installation

### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/task-pro.git
cd task-pro
```

### **2. Backend Setup**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```
Start the backend:
```bash
npm run dev
```

### **3. Frontend Setup**
```bash
cd ../frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

---

## 📡 API Endpoints

### **Authentication**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login & get JWT Token |
| `PUT` | `/api/auth/profile` | Private | Update user profile |

### **Tasks**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private | Get tasks (Admin: all, Member: assigned) |
| `POST` | `/api/tasks` | Admin | Create a new task |
| `PUT` | `/api/tasks/:id/status`| Private | Update task status |

### **Dashboard**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Private | Get aggregated statistics |

---

## 📸 Screenshots Section

> [!TIP]
> **Dashboard Overview**: A stunning view of your team's productivity.
> ![Dashboard Screenshot](https://raw.githubusercontent.com/yourusername/task-pro/main/screenshots/dashboard.png)

> [!TIP]
> **Settings & Profile**: Manage your professional identity.
> ![Settings Screenshot](https://raw.githubusercontent.com/yourusername/task-pro/main/screenshots/settings.png)

---

## 🚀 Future Improvements

- [ ] **Real-time Notifications**: Socket.io integration for instant task updates.
- [ ] **Dark Mode**: Toggleable dark/light themes for all pages.
- [ ] **File Attachments**: Ability to upload documents and images to tasks.
- [ ] **Team Chat**: Integrated chat for project-specific discussions.
- [ ] **Google Calendar Sync**: Automatically sync task deadlines with your calendar.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

---
**TaskPro** - Built with ❤️ by Antigravity AI
