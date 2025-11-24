# BagItNow 👜

BagItNow is a simple e-commerce web application where users can browse products, add them to a cart, and manage a personal wishlist.  
The project uses a **vanilla HTML/CSS/JS frontend** and a **Node.js + Express + MongoDB** backend.

---

## ✨ Features

- **Product Listing**
  - Static product catalog displayed in responsive grids
  - Product images, names and prices

- **Search**
  - Search bar in the navbar to filter products by name

- **Shopping Cart**
  - Add products to cart from the main shop page
  - Cart items stored per user in MongoDB
  - Quantity updates & basic price calculation (depending on implementation)

- **User Authentication**
  - Email + password based user accounts
  - User-specific cart and wishlist

- **Wishlist**
  - Heart icon on each product to add/remove from wishlist
  - Dedicated `wishlist.html` page to view all saved items
  - Wishlist stored in the `User` document in MongoDB

- **Responsive UI**
  - Navbar, hero section, product grids, about section and footer
  - Mobile and tablet responsive using CSS media queries

---

## 🧱 Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose

---

## 📁 Project Structure

Example structure (may vary slightly):

```bash
Bag_It_Now/
├── backend/
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── wishlistRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env           # MONGO_URI, PORT
├── image/             # Product images
├── index.html         # Main landing + shop page
├── wishlist.html      # Wishlist page
├── cart.html          # Cart page
├── sign.html          # Login / signup page
├── index.css          # Main stylesheet
└── script.js          # Frontend logic (search, wishlist hearts, etc.)
