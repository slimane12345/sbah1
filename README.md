# Sbah ☀️ - Food Delivery Platform

## 📝 Overview

Sbah is a comprehensive food delivery platform designed for the Moroccan market. The project includes a feature-rich administrative dashboard, a dynamic customer-facing application for browsing and ordering, and a dedicated interface for delivery drivers.

This project is built with a modern tech stack and is structured for deployment on platforms like Netlify (for the frontend) and a Node.js-compatible service for the backend.

## ✨ Features

*   **Admin Dashboard**:
    *   Real-time analytics on orders, revenue, customers, and restaurants.
    *   Full CRUD management for orders, restaurants, products, categories, drivers, and users.
    *   Financial reporting and marketing campaign management.
    *   Gemini AI-powered analytics for restaurant performance evaluation.
    *   System-wide settings configuration.
*   **Customer Application**:
    *   Browse restaurants, categories, and recommended products.
    *   Dynamic, location-aware user homepage.
    *   Detailed product view with customization options.
    *   Full checkout process with dynamic delivery fee calculation.
    *   User profile management with order history and saved addresses.
    *   Real-time order tracking on a map.
*   **Driver Dashboard**:
    *   Driver-specific login and online/offline status management.
    *   View and accept nearby new orders based on location.
    *   Active order management with map-based tracking from restaurant to customer.
    *   View earnings and delivery statistics.

## 🚀 Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Leaflet.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (via Mongoose) and Firebase Firestore for real-time data.
*   **Services**:
    *   Firebase (Authentication, Firestore)
    *   Google Gemini API (AI Analytics)
    *   OpenStreetMap/Nominatim (Geocoding & Maps)

## 📁 Project Structure

The project contains a React SPA, a Node.js backend, and several standalone vanilla JS pages, organized for deployment.

-   `/`: Root contains the React/TSX source code (`components`, `pages`, `App.tsx`, etc.).
-   **Backend Files** (`server.js`, `models`, `routes`, etc.): Also located at the root, forming the Node.js backend.
-   `/public`: The main deployment directory for frontend assets. It contains all HTML entry points.
-   `/assets`: Contains static assets like CSS stylesheets.
-   `/scripts`: Contains shared client-side JavaScript modules, including the Firebase configuration.

## 🚀 Deployment

This project is structured for a split frontend/backend deployment.

1.  **Frontend (Netlify)**:
    *   **Build Command**: This project uses ES modules directly in the browser via `importmap`. For a production setup, a build tool like Vite or Webpack would typically be used to bundle the TSX files. The command would be `npm run build`.
    *   **Publish Directory**: Set the publish directory in Netlify to `/public`. This directory contains all the necessary HTML files that serve as entry points for the application.
2.  **Backend (Heroku, Vercel, etc.)**:
    *   The Node.js backend (`server.js` and related files) should be deployed to a separate service that supports Node.js applications.
    *   Ensure all necessary environment variables (e.g., `MONGODB_URI`, `JWT_SECRET`, `API_KEY`) are configured on the deployment platform.
    *   The frontend must be configured to send API requests to the deployed backend URL.
