# Architecture Overview

This document describes the high-level architecture of the Agence Voyage application.

## 🏛 System Architecture

The application follows a modern **Decoupled Architecture**, separating the presentation layer from the business logic and data persistence.

### 1. Backend (Spring Boot)
The backend is built using the **N-tier Architecture** pattern:
- **Controller Layer:** Handles incoming RESTful API requests and manages HTTP responses.
- **Service Layer:** Contains the business logic, orchestrating data between controllers and repositories.
- **Repository Layer:** Utilizes Spring Data JPA for data access and abstraction over the MySQL database.
- **Entity Layer:** Defines the domain model using JPA annotations.
- **DTO Layer:** Data Transfer Objects used to decouple internal entities from the external API.

### 2. Frontend (Angular)
The frontend is a **Single Page Application (SPA)** with the following characteristics:
- **Modular Design:** Functionalities are split into logical modules (Admin, Client, Auth).
- **Lazy Loading:** Routes are loaded on demand to reduce initial load time.
- **Reactive State Management:** Uses RxJS for handling asynchronous data flows.
- **Responsive Layout:** Designed for various screen sizes using custom CSS.

## 🔄 Data Flow

1. **User Interaction:** A user interacts with the Angular frontend.
2. **API Call:** The frontend makes an HTTP request to the Spring Boot backend.
3. **Security Check:** Spring Security intercepts the request to validate authentication/authorization.
4. **Processing:** The Controller routes the request to the appropriate Service.
5. **Persistence:** The Service interacts with the Repository to fetch or store data in MySQL.
6. **Response:** The backend returns a JSON response to the frontend.
7. **UI Update:** The frontend updates the view based on the received data.

## 💳 Payment Integration (PayPal)

The application integrates with the PayPal REST API:
- **Initiation:** When a client creates a reservation, the system can initiate a PayPal payment.
- **Execution:** The `PaypalService` handles communication with PayPal's servers using the `checkout-sdk`.
- **Completion:** After a successful payment, PayPal redirects the user back to the application, and the reservation status is updated.

## 🧪 Testing & Quality

The project maintains high code quality through automated testing:
- **Backend Testing:** Uses **JUnit 5** and **Mockito** for unit and integration tests. Core services (like `ClientService`) are thoroughly tested to ensure correct business logic and edge-case handling.
- **Frontend Testing:** Uses **Karma** and **Jasmine** (standard Angular testing tools) for component and service validation.

## ⚖️ License
This project is private and intended for demonstration purposes.
