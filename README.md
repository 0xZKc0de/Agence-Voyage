# Agence Voyage - Travel Agency Management System

A professional, full-stack web application designed for travel agencies to manage circuits, reservations, and client interactions. This project features a robust Spring Boot backend and a modern Angular frontend with integrated PayPal payments.

---

## 🚀 Features

### For Clients
- **Explore Circuits:** Browse and search for travel destinations with detailed information.
- **Secure Booking:** Book circuits with real-time availability checks.
- **Payment Integration:** Secure checkout using PayPal SDK.
- **My Reservations:** View and manage personal travel bookings.
- **Profile Management:** Update personal details and account settings.

### For Administrators
- **Dashboard:** At-a-glance view of agency performance (total revenue, circuits count, reservations count).
- **Circuit Management:** Complete CRUD (Create, Read, Update, Delete) operations for travel circuits.
- **Client & Reservation Tracking:** Monitor all client activities and booking statuses.

---

## 🛠 Tech Stack

### Backend
- **Java 21**
- **Spring Boot 4.0.1** (Spring Data JPA, Spring Security, Spring Web)
- **MySQL** Database
- **PayPal SDK** for payment processing
- **Lombok** for clean, boilerplate-free code

### Frontend
- **Angular 20.3**
- **TypeScript**
- **Lazy Loading** for optimized performance
- **Server-Side Rendering (SSR)** support
- **Vanilla CSS** for custom, lightweight styling

---

## 📂 Project Structure

```text
Agence-Voyage/
├── back-end/               # Spring Boot Application
│   ├── src/main/java/      # Source code (Controllers, Entities, Services)
│   ├── src/main/resources/ # Configuration & Properties
│   └── pom.xml             # Maven dependencies
├── front-end/              # Angular SPA
│   ├── src/app/            # Application components and services
│   ├── src/assets/         # Static assets
│   └── package.json        # Node.js dependencies
└── docs/                   # Detailed documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- JDK 21+
- Node.js 20+
- MySQL Server
- PayPal Developer Account (for API credentials)

### Backend Setup
1. Configure your database in `back-end/src/main/resources/application.properties`.
2. Set your PayPal credentials in the same file.
3. Run the application:
   ```bash
   cd back-end
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd front-end
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
3. Open `http://localhost:4200` in your browser.

---

## 📄 Documentation

For more detailed information, please refer to the following guides in the `docs/` directory:

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Frontend Guide](./docs/FRONTEND_GUIDE.md)

---

## ⚖️ License
This project is private and intended for demonstration purposes.
