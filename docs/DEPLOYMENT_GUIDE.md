# Deployment Workflow: Frontend & Backend

This guide explains how to deploy your Smart Canteen application using Netlify (for Frontend) and Render/Railway (for Backend).

## 1. Backend Deployment (Render.com)

Since your backend uses a local JSON file database (`data/users.json`, etc.), you need a platform that supports persistent disks or use a cloud database (like MongoDB). For a simple direct transition:

1.  **Push to GitHub**: Create a repository and push the `smart-canteen-backend` folder.
2.  **Render Setup**: 
    *   Connect your GitHub.
    *   Select **Web Service**.
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Important**: Add a "Disk" (Mount Path: `/data`) or use a simple free tier (Note: Free tier resets JSON files on restart).
3.  **Get URL**: Copy the URL (e.g., `https://canteen-api.onrender.com`).

## 2. Frontend Deployment (Netlify)

1.  **Update API Link**: In `smart-canteen-frontend/src/services/api.js`, change:
    ```javascript
    const API_URL = 'https://your-backend-url.onrender.com/api';
    ```
2.  **Build**: Run `npm run build` in the frontend folder.
3.  **Deploy**:
    *   Create a Netlify account.
    *   Drag and drop the `dist` folder into Netlify Drop.
    *   **OR** Connect GitHub and set:
        *   **Build Command**: `npm run build`
        *   **Publish directory**: `dist`
4.  **Add `_redirects`**: For React Router to work, create a file named `public/_redirects` with:
    ```text
    /*  /index.html  200
    ```

## 3. Comparison

| Method | Best For | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Localtunnel** | Quick Testing | Instant, no setup | Goes offline when PC closes |
| **Netlify / Vercel** | Frontend | FAST, Free, Auto-SSL | Needs manual Backend setup |
| **Render / Railway** | Backend | Permanent, 24/7 | Free tier sleeps after 15m |

---
*Recommended: Use GitHub to sync both folders and connect them to Netlify/Render for automatic live updates!*
