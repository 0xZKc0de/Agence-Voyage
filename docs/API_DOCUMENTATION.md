# API Documentation

The Agence Voyage backend provides a RESTful API for managing circuits, clients, and reservations.

## 🔑 Authentication

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Authenticate user (Admin or Client) and start session. |
| POST | `/api/auth/logout` | Invalidate session and logout user. |
| POST | `/api/auth/register` | Register a new client account. |

## 🗺 Circuits

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/v1/circuits` | Get paginated list of circuits. |
| GET | `/api/v1/circuits/all` | Get all circuits (non-paginated). |
| GET | `/api/v1/circuits/destinations` | Get list of unique destinations. |
| GET | `/api/v1/circuits/get/{id}` | Get detailed information for a specific circuit. |
| GET | `/api/v1/circuits/search/{destination}` | Search circuits by destination. |
| POST | `/api/v1/circuits/add` | Add a new circuit (Admin only). |
| PUT | `/api/v1/circuits/update/{id}` | Update an existing circuit (Admin only). |
| DELETE | `/api/v1/circuits/delete/{id}` | Remove a circuit (Admin only). |
| GET | `/api/v1/circuits/count` | Get total number of circuits. |

## 📅 Reservations

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/reservations/create` | Create a new reservation request. |
| GET | `/api/reservations` | List all reservations (Admin only). |
| GET | `/api/reservations/my-reservations` | List reservations for the currently logged-in client. |
| PUT | `/api/reservations/{id}/update` | Update reservation details. |
| PUT | `/api/reservations/{id}/cancel` | Cancel a reservation. |
| GET | `/api/reservations/count` | Get total number of reservations. |
| GET | `/api/reservations/revenue` | Get total agency revenue (Admin only). |

## 💳 Payments

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/payment/create` | Initiate a PayPal payment for a reservation. |
| POST | `/api/payment/execute` | Execute/Confirm a PayPal payment after user approval. |

---

**Note:** Most Admin-specific endpoints require the user to have the `ROLE_ADMIN` authority. Client-specific endpoints require `ROLE_CLIENT`. All requests should include session cookies if authenticated.
