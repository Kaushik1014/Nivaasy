# 🏠 Nivaasy — Vacation Rental Marketplace

> **Live Demo:** 🔗[https://nivaasy.onrender.com/listings](#)  
<!-- Replace the # above with your deployed URL when available -->

Nivaasy is a full-stack vacation rental platform inspired by Airbnb, where users can discover, list, and review unique stays around the world. Built with **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Sign up, log in & log out with Passport.js |
| 🏡 **Listings CRUD** | Create, read, update & delete property listings |
| ⭐ **Reviews** | Authenticated users can leave 1–5 star reviews with comments |
| 🗺️ **Interactive Maps** | Geocoded listing locations displayed via Leaflet + OpenStreetMap |
| ☁️ **Image Uploads** | Upload listing photos to Cloudinary with Multer |
| 🔍 **Search & Filters** | Search listings by keyword and filter by category |
| 🏷️ **Categories** | Trending, Rooms, Iconic Cities, Mountains, Castles, Pools, Camping, Farms, Arctic, Deserts |
| 💰 **Tax Toggle** | View prices with or without taxes |
| 📱 **Responsive Design** | Mobile-friendly UI with EJS templates & Bootstrap |
| ⚡ **Flash Messages** | User-friendly success & error notifications |
| 🛡️ **Authorization** | Only listing owners can edit/delete their listings |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express 5 |
| **Database** | MongoDB Atlas + Mongoose |
| **Templating** | EJS + EJS-Mate layouts |
| **Auth** | Passport.js (Local Strategy) |
| **File Uploads** | Multer + Cloudinary |
| **Validation** | Joi (server-side schema validation) |
| **Sessions** | express-session + connect-mongo |
| **Maps** | Leaflet.js / OpenStreetMap |
| **Styling** | CSS + Bootstrap |

---

## 📂 Project Structure

```
Nivaasy/
├── app.js                 # Express app entry point
├── cloudConfig.js         # Cloudinary configuration
├── middleware.js           # Auth & validation middleware
├── schema.js              # Joi validation schemas
│
├── controllers/           # Route handler logic
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/                # Mongoose schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/                # Express routers
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/                 # EJS templates
│   ├── layouts/
│   ├── includes/
│   ├── listings/
│   └── users/
│
├── public/                # Static assets
│   ├── CSS/
│   └── js/
│
├── init/                  # Database seed data
├── utils/                 # Error handling utilities
├── .env                   # Environment variables (not committed)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account for image hosting

### 1. Clone the repository

```bash
git clone https://github.com/Kaushik1014/Nivaasy.git
cd Nivaasy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret_key

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

GEOAPIFY_API_KEY=your_geoapify_api_key
```

### 4. Seed the database *(optional)*

```bash
node init/index.js
```

### 5. Start the server

```bash
node app.js
```

The app will be running at **http://localhost:8080** 🎉

---

## 🌐 Live Demo

> **🔗 Live Link:** [https://nivaasy.onrender.com/listings](#)

<!-- ✅ Replace the link above once deployed (e.g., Render, Railway, Vercel, etc.) -->

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**Kaushik Gautam**  
GitHub: [@Kaushik1014](https://github.com/Kaushik1014)

---

<p align="center">Made with ❤️ by Kaushik</p>
