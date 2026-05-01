# Database Schema

The Agence Voyage application uses a relational database (MySQL) with the following schema, managed via Hibernate/JPA.

## 🗃 Tables

### 1. `admin`
Stores administrative user accounts.
- `id` (INT, PK): Unique identifier.
- `email` (VARCHAR, Unique): Login email.
- `password` (VARCHAR): BCrypt hashed password.
- `role` (VARCHAR): Typically 'ROLE_ADMIN'.

### 2. `client`
Stores client user accounts.
- `id` (INT, PK): Unique identifier.
- `email` (VARCHAR, Unique): Login email.
- `password` (VARCHAR): BCrypt hashed password.
- `name` (VARCHAR): Client's full name.
- `role` (VARCHAR): Typically 'ROLE_CLIENT'.

### 3. `circuit`
Stores travel circuit details.
- `id` (INT, PK): Unique identifier.
- `distination` (VARCHAR): Target destination.
- `date_depart` (DATETIME): Departure date.
- `date_arrive` (DATETIME): Arrival date.
- `nb_places` (INT): Available spots.
- `prix` (DOUBLE): Price per person.
- `description` (TEXT): Detailed description.
- `image_url` (VARCHAR): Path or URL to circuit image.
- `admin_id` (INT, FK): The administrator who created the circuit.

### 4. `reservation`
Stores booking records.
- `id` (INT, PK): Unique identifier.
- `date` (DATETIME, Unique): Reservation timestamp.
- `nb_persons` (INT): Number of people in the booking.
- `status` (VARCHAR): Status (e.g., PENDING, CONFIRMED, CANCELLED).
- `client_id` (INT, FK): The client who made the booking.
- `circuit_id` (INT, FK): The booked circuit.
- `admin_id` (INT, FK): Assigned administrator.

### 5. `payment`
Stores transaction records.
- `id` (INT, PK): Unique identifier.
- `paypal_order_id` (VARCHAR): Reference to PayPal transaction.
- `amount` (DOUBLE): Paid amount.
- `status` (VARCHAR): Payment status.
- `reservation_id` (INT, FK): One-to-one link to the reservation.

## 📐 Relationships

- **Admin 1:N Circuit:** An admin can manage multiple circuits.
- **Client 1:N Reservation:** A client can have multiple reservations.
- **Circuit 1:N Reservation:** A circuit can be booked by many clients (multiple reservations).
- **Reservation 1:1 Payment:** Each reservation has exactly one payment record.
