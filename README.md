# PriceHunt 🎯
> **Tagline:** *"Hunt the Best Price."*

PriceHunt is a full-stack smart e-commerce product price comparison platform. It allows users to search for products and compare listings across multiple e-commerce sources (Amazon, Flipkart, Croma, Reliance Digital) in one unified dashboard.

---

## 🌟 Key Features

1. **Multi-Store Price Comparison**: View listings side-by-side with real-time prices, original MSRPs, and discount percentages.
2. **⚡ Smart Best Deal Scoring Algorithm**: Evaluates deals using a weighted 5-factor scoring model:
   - Price Score ($40\%$)
   - Product Rating ($20\%$)
   - Seller Reliability & Platform Trust ($15\%$)
   - Discount Percentage ($15\%$)
   - Delivery Speed & Shipping Cost ($10\%$)
3. **🧠 Smart Product Matching Engine**: Fuzzy multi-attribute similarity matching (Brand $30\%$, Model $30\%$, Specs/Variants $25\%$, Title token similarity $15\%$).
4. **📉 90-Day Interactive Price History**: Native HTML5 Canvas charts tracking historical price drops.
5. **🔔 Target Price Drop Alerts**: Triggered notifications when a product reaches a user's target price.
6. **❤️ Unified User Wishlist & Dashboard**: Save favorite products across any store.
7. **🔒 Complete Authentication & Security**: Spring Security, BCrypt password hashing, and stateless JWT authorization.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: HTML5, Modern CSS3 (Custom Design System & CSS Variables), JavaScript (ES6+ Fetch API with intelligent mock fallback)
- **Backend**: Java 17+, Spring Boot 3.2.x, Spring Data JPA, Spring Security, JJWT
- **Database**: MySQL 8.0+ (with H2 in-memory fallback support)

---

## 📁 Project Structure

```text
PriceHunt/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/pricehunt/
│       │   │   ├── config/            # Security, JWT, CORS, DataInitializer
│       │   │   ├── controller/        # Auth, Products, Compare, Alerts, Favorites, User
│       │   │   ├── dto/               # Request & Response transfer objects
│       │   │   ├── entity/            # JPA Entities (User, Product, Platform, Listing, etc.)
│       │   │   ├── repository/        # Spring Data Repositories
│       │   │   └── service/           # Matching engine, Comparison scoring, Auth
│       │   └── resources/
│       │       └── application.properties
├── database/
│   ├── schema.sql                     # MySQL table creation DDL
│   └── sample-data.sql                # Seed datasets for electronics & price histories
├── frontend/
│   ├── css/
│   │   └── style.css                  # Modern responsive design system
│   ├── js/
│   │   ├── api.js                     # Unified API client & standalone mock engine
│   │   ├── auth.js                    # Session, login, signup, password resets
│   │   ├── search.js                  # Search querying, faceted filters, card renderer
│   │   └── comparison.js              # Matrix table & HTML5 Canvas history chart
│   ├── index.html                     # Landing page
│   ├── login.html                     # Authentication login page
│   ├── signup.html                    # User registration page
│   ├── forgot-password.html           # Password recovery
│   ├── reset-password.html            # Password reset
│   ├── dashboard.html                 # Authenticated user hub
│   ├── search.html                    # Search & faceted filter results
│   ├── product.html                   # Flagship Comparison Matrix & History Chart
│   ├── favorites.html                 # Saved wishlist
│   ├── alerts.html                    # Price drop alerts manager
│   └── profile.html                   # User profile & account security
└── README.md
```

---

## 🚀 How to Run the Application

### Option A: Standalone Frontend (Instant Test)
1. Open the `PriceHunt/frontend/index.html` file in VS Code.
2. Right-click and choose **"Open with Live Server"** (or open `index.html` in any browser).
3. The frontend is fully functional with an intelligent client mock engine! You can search for *"iPhone 15"*, *"MacBook Air"*, test filters, compare prices, view price history charts, and log in (`demo@pricehunt.com` / `password123`).

### Option B: Full-Stack (Spring Boot + MySQL)
1. **Set up MySQL Database**:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/sample-data.sql
   ```
2. **Start Spring Boot Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   *The backend REST API will start on `http://localhost:8080` and auto-seed sample data if empty.*
3. **Open Frontend**:
   Open `frontend/index.html` in your browser. All requests will communicate directly with the Spring Boot REST API.
