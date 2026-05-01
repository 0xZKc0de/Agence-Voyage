# Frontend Guide

This document provides an overview of the Angular frontend application for Agence Voyage.

## 📁 Application Structure

The source code is located in `front-end/src/app`. It follows a feature-based modular structure:

### 1. Core & Auth
- **`auth/`**: Contains login and registration components.
- **`auth.service.ts`**: Handles user authentication state and communication with `/api/auth`.
- **`auth.guard.ts`**: Protects routes based on the user's login status and role.

### 2. Admin Module (`admin/`)
The admin area is protected and requires `ROLE_ADMIN`.
- **`admin-layout/`**: The main container for admin pages (sidebar, header).
- **`dashboard/`**: Displays statistical cards (revenue, counts).
- **`trips/`**: Management of circuits (List, Create, Edit).
- **`clients/`**: View and manage registered clients.
- **`reservations/`**: Monitor all bookings.

### 3. Client Module (`client/`)
The client area for browsing and booking.
- **`client-layout/`**: The main container for client pages (navbar, footer).
- **`website/home/`**: The landing page with featured circuits.
- **`circuits/`**: Circuit listing and search.
- **`reservations/`**: Booking creation and personal reservation list.
- **`payment/`**: Integration for PayPal checkout.
- **`profile/`**: User account settings.

## 🛣 Routing Strategy

The application uses **Lazy Loading** to optimize performance. Main route definitions can be found in `app.routes.ts`:

```typescript
export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes) },
  { path: 'client', loadChildren: () => import('./client/client.routes').then(m => m.clientRoutes) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes) },
  // ...
];
```

## 🛠 Shared Services

Services located in `app/services/` act as the bridge between the UI and the Backend API:
- **`CircuitService`**: Fetches and manages circuit data.
- **`ReservationService`**: Handles booking logic.
- **`PaypalService`**: Manages the payment flow.
- **`ClientService`**: Handles client-specific data.

## 🎨 Styling

- The project uses **Vanilla CSS** located alongside components (`*.component.css`) and global styles in `styles.css`.
- Interactive elements utilize standard Angular directives (`*ngIf`, `*ngFor`, `[ngModel]`).
