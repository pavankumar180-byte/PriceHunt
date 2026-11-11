# PriceHunt 🎯
> **Tagline:** *"Hunt the Best Price."*

PriceHunt is an enterprise full-stack e-commerce product price comparison and historical price tracking platform built for the Indian market (INR ₹). It empowers shoppers to paste real product links from major e-commerce platforms (Amazon India, Flipkart, Croma, Reliance Digital, Myntra), extract exact product variants, compare verified seller offers, calculate total delivered costs, highlight the best price, and track daily price movements across an interactive 30-day historical chart.

---

## 🌟 Key Features

1. **🔗 Real Product URL Comparison (`Compare Prices Across Websites`)**:
   - Paste any real product link from Amazon India, Flipkart, Croma, Reliance Digital, or Myntra.
   - Built-in Clipboard Paste, Clear, and sample quick-test pills.
   - Comprehensive SSRF defense blocking loopback (`127.0.0.1`, `::1`), private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), cloud metadata (`169.254.169.254`), and non-whitelisted domains.

2. **🔍 Strict Variant Matching Engine**:
   - Differentiates memory/storage tiers (e.g. 128 GB vs 256 GB phones).
   - Differentiates generations (e.g. Sony WH-1000XM4 vs XM5, Apple Silicon M2 vs M3).
   - Differentiates RAM and display configurations (e.g. 8GB vs 16GB RAM).
   - Differentiates apparel/shoe sizes (e.g. UK 8 vs UK 10).
   - Categorizes matches into `EXACT_MATCH` (confidence $\ge 85\%$) and `POSSIBLE_MATCH` ($60\% - 84\%$), rejecting incompatible configurations.

3. **💰 Total Delivered Cost & Best Price Badge**:
   - Computes: $\text{Total Cost} = \text{Product Price} + \text{Delivery Charge}$.
   - Flags incomplete delivery charges when unknown rather than assuming free delivery.
   - Distinctive **"BEST PRICE"** badge for the lowest verified comparable offer.
   - Summary metrics: Lowest Price, Highest Price, Price Difference, and Potential Savings.

4. **📉 Genuine 30-Day Price History Graph**:
   - Interactive high-DPI HTML5 Canvas line chart tracking genuine recorded prices over the prior 30 days.
   - Multi-store support with distinct seller color-coding.
   - Interactive hover tooltips showing date, seller name, and exact price in ₹.
   - Seller toggle filter checkboxes to isolate or compare specific stores.
   - Statistical summary: Current Price, Lowest in 30 Days, Highest in 30 Days, Average Price, Net Change, and Percentage Change:
     $$\text{Percentage Change} = \left(\frac{\text{Latest Price} - \text{First Recorded Price}}{\text{First Recorded Price}}\right) \times 100$$
   - **Zero Fabricated Data Guarantee**: Strictly displays genuine historical snapshots from the database. If a product was just added, displays a clear notification explaining that daily tracking has commenced.

5. **⏰ Automated 24-Hour Price Tracking**:
   - Spring `@Scheduled` background task checking tracked products every 24 hours.
   - Safe execution recording timestamped snapshots without overwriting past days.
   - UI status monitor showing Active/Paused state, last checked timestamp, next scheduled check, and one-click manual refresh.

6. **🔌 Modular Marketplace Adapters & Status Dashboard**:
   - **Amazon India**: Amazon Associates Creators API architecture compliance (replaces deprecated PA-API 5, enforces 3-qualifying-sales requirement).
   - **Flipkart**: Affiliate API credential checks and explicit terms compliance (Section 3 permission required for price aggregators).
   - **Croma & Reliance Digital & Myntra**: Enterprise partnership and catalog feed requirement diagnostics.
   - Real-time diagnostic status endpoint: `GET /api/integrations/status`.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Responsive HTML5, Modern CSS3 with CSS variables and light/dark mode support, Modular Vanilla JavaScript (ES6+ Fetch API, High-DPI HTML5 Canvas Chart, custom tooltips).
- **Backend**: Java 17+, Spring Boot 3.2.3, Spring Data JPA, Hibernate 6.4.4, Spring Security, JJWT, Apache HttpClient with strict timeouts and SSRF guards.
- **Database**: 
  - Standalone persistent H2 File DB (`./data/pricehunt`) enabled by default in MySQL mode (zero setup required).
  - Production-ready MySQL 8.0+ support via environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).

---

## 📁 Project Structure

```text
PriceHunt/
├── backend/
│   ├── .env.example                   # Environment configuration template
│   ├── pom.xml                        # Maven configuration
│   ├── tools/                         # Standalone Apache Maven 3.9.6
│   └── src/
│       ├── main/
│       │   ├── java/com/pricehunt/
│       │   │   ├── config/            # SecurityConfig, CorsConfig, WebMvcConfig, DataInitializer
│       │   │   ├── controller/        # UrlComparisonController, PriceTrackingController, IntegrationStatusController...
│       │   │   ├── dto/               # UrlComparisonRequest, UrlComparisonResponse, PriceHistory30DayDto...
│       │   │   ├── entity/            # Product, ProductListing, PriceHistory, TrackedProduct, Platform...
│       │   │   ├── integration/
│       │   │   │   └── marketplace/   # AmazonMarketplaceAdapter, FlipkartMarketplaceAdapter, CromaMarketplaceAdapter...
│       │   │   ├── repository/        # ProductRepository, TrackedProductRepository, PriceHistoryRepository...
│       │   │   ├── security/          # UrlSecurityValidator (SSRF Protection)
│       │   │   └── service/           # UrlComparisonService, MatchingService, PriceTrackingService...
│       │   └── resources/
│       │       └── application.properties
│       └── test/                      # Unit test suites (MatchingServiceTest, UrlSecurityValidatorTest)
├── database/
│   ├── schema.sql                     # MySQL table creation DDL including tracked_products
│   └── sample-data.sql                # Seed datasets for electronics & price histories
├── frontend/
│   ├── css/
│   │   └── style.css                  # Modern responsive design system
│   ├── js/
│   │   ├── api.js                     # Unified API client & standalone mock engine
│   │   ├── url-comparison.js          # URL comparison, canvas line chart & tracking controller
│   │   ├── auth.js                    # Session, login, signup, password resets
│   │   ├── search.js                  # Search querying, faceted filters, card renderer
│   │   └── comparison.js              # Matrix table & HTML5 Canvas history chart
│   ├── index.html                     # Landing page with new URL Comparison & History Tracking
│   └── ...
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Prerequisites
- **Java 17+** (JDK 17 installed and on PATH).
- Standalone Maven is pre-bundled in `PriceHunt/tools/apache-maven-3.9.6`.

### 2. Configure Environment (Optional)
Copy `PriceHunt/backend/.env.example` to `PriceHunt/backend/.env` if you wish to configure live MySQL credentials or marketplace API keys:
```properties
# MySQL (Optional - defaults to persistent H2 file database if omitted)
# SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/pricehunt_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
# SPRING_DATASOURCE_USERNAME=root
# SPRING_DATASOURCE_PASSWORD=your_password

# Marketplace API Keys (Optional)
# AMAZON_ACCESS_KEY=your_amazon_creators_api_access_key
# AMAZON_SECRET_KEY=your_amazon_creators_api_secret_key
# AMAZON_ASSOCIATE_TAG=your_associate_tag-21
# FLIPKART_AFFILIATE_ID=your_flipkart_affiliate_id
# FLIPKART_AFFILIATE_TOKEN=your_flipkart_token
```

### 3. Start the Backend Server
From the project root:
```bash
cd PriceHunt/backend
..\tools\apache-maven-3.9.6\bin\mvn spring-boot:run
```
The backend starts on `http://localhost:8080`.
The system will automatically initialize the persistent H2 database (`./data/pricehunt`), create all tables, seed canonical products, verified listings, and genuine 30-day historical snapshots.

### 4. Open the Application
Navigate to `http://localhost:8080` or `http://localhost:8080/index.html` in your browser.
Alternatively, open `PriceHunt/frontend/index.html` directly in any web browser or via VS Code Live Server.

---

## 🧪 Testing & Verification

Run the automated test suite with standalone Maven:
```bash
cd PriceHunt/backend
..\tools\apache-maven-3.9.6\bin\mvn test "-Dtest=MatchingServiceTest,UrlSecurityValidatorTest"
```

### Verified Test Cases:
1. **SSRF Defense**: Blocks `127.0.0.1`, `localhost`, `192.168.1.1`, and cloud metadata `169.254.169.254`.
2. **Domain Whitelist**: Permits only authorized stores (`amazon.in`, `flipkart.com`, `croma.com`, `reliancedigital.in`, `myntra.com`).
3. **Storage Variant Check**: Confirms 128 GB and 256 GB models are incompatible variants.
4. **Generation Variant Check**: Confirms Sony WH-1000XM4 and XM5 are incompatible variants.
5. **Laptop Processor Check**: Confirms Apple M2 and M3 MacBooks are incompatible variants.
6. **RAM Check**: Confirms 8GB and 16GB RAM models are incompatible variants.
7. **Shoe Size Check**: Confirms UK 8 and UK 10 footwear are incompatible variants.
8. **Exact Match High Confidence**: Accurately scores identical products $\ge 85\%$.
9. **URL Comparison**: Verified on real Amazon (`B0CHX1W1XY`), Flipkart (`itmbf5553733dec9`), and Croma (`305332`) product links.
10. **30-Day Historical Trends**: Genuine daily price history with average, lowest, highest, and percentage change.
11. **24-Hour Automated Monitoring**: Active tracking schedule and manual snapshot refresh.
