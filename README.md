# 🍱 Smart Canteen Management System

A full-stack canteen management solution with role-based dashboards, secure authentication, and real-time order tracking.

---

## 📂 1. Project Organization (Folder Setup)

To ensure the project works without path errors, maintain this exact structure:

*   **Main Folder Name**: `smart-canteen-system` (or any name you prefer)
    *   📁 `smart-canteen-frontend/` (contains the React code)
    *   📁 `smart-canteen-backend/` (contains the Node.js API)
    *   📁 `docs/` (Documentation)
    *   📁 `tests/` (Test scripts)
    *   📄 `package.json` (Root configuration)
    *   📄 `README.md` (This guide)

---

## ⚙️ 2. Configuration & Paths

Before running, you must ensure the Frontend knows where the Backend is:

### 📍 Frontend API Path
1.  Navigate to: `smart-canteen-frontend/src/services/api.js`
2.  Set the `API_URL` based on your usage:
    *   **Local PC Only**: `const API_URL = 'http://localhost:5000/api';`
    *   **Mobile/External Access**: Update to your tunnel or live URL.

### 📍 Backend Environment
1.  Check the `.env` file in `smart-canteen-backend/`.
2.  Ensure `PORT=5000` matches your frontend API path.

---

## 🛠️ 3. Installation Guide (For New Computers)

Follow these steps exactly to setup on a new PC using **VS Code**:

### Step 1: Install Software
*   **Node.js**: [Download & Install](https://nodejs.org/) (Choose the LTS version).
*   **VS Code**: [Download & Install](https://code.visualstudio.com/).

### Step 2: Open Folder
*   Open VS Code.
*   Go to `File > Open Folder`.
*   **IMPORTANT**: Select the **ROOT** folder (the one containing this README). Do NOT open just the frontend or backend folder.

### Step 3: Install Required Libraries
Open the VS Code Terminal (``Ctrl + ` ``) and run:
```bash
npm run install:all
```
This command automatically installs all the necessary components for you:

**Frontend Libraries installed:**
*   `react`, `react-router-dom` (Navigation)
*   `axios` (API Requests)
*   `lucide-react` (Icons)
*   `recharts` (Analytics Charts)
*   `socket.io-client` (Real-time notifications)

**Backend Libraries installed:**
*   `express` (Server framework)
*   `jsonwebtoken` (Security)
*   `bcryptjs` (Password hashing)
*   `cors`, `body-parser` (Middleware)
*   `socket.io` (Real-time events)

---

## 🚀 4. How to Run the Project

1.  In the VS Code Terminal, type:
    ```bash
    npm run dev
    ```
2.  The terminal will start both servers.
3.  Open your browser to: **`http://localhost:5173`**

---

## 🔑 Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@canteen.com` | `password` |
| **Student** | `student@canteen.com` | `password` |
| **Distributor** | `staff@canteen.com` | `password` |

---

## ❓ Troubleshooting Tips
*   **Error: "npm is not recognized"**: Restart your computer after installing Node.js.
*   **Error: "Path Not Found"**: Ensure you are in the root directory. Type `ls` or `dir` to see if `package.json` is visible.
*   **Blank Page**: Check if the Backend is running and the API URL in `api.js` is correct.

---

## 👥 Development Team

This project was collaboratively developed by:

1.  **Member 1** - [GitHub Profile](https://github.com/dhanushsit)
2.  **Member 2** - [GitHub Profile](https://github.com/mcram2008-commits)
3.  **Member 3** - [GitHub Profile](https://github.com/your-username-3)

---
*Created with ❤️ for Smart Canteen Presentation 2026.*
