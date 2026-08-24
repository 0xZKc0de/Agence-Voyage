---
type: Service
title: Frontend overview
description: Angular application structure, bootstrap sequence, and the major client/admin route families for the travel agency UI.
tags: [frontend, angular, routes]
---

## Application bootstrap

The frontend is an Angular application defined in [front-end/src/app/app.ts](../../front-end/src/app/app.ts), with routing configured in [front-end/src/app/app.routes.ts](../../front-end/src/app/app.routes.ts#L1-L22). The root app bootstraps three major route groups:

- `auth` loads the auth routes from [front-end/src/app/auth/auth.routes.ts](../../front-end/src/app/auth/auth.routes.ts)
- `client` loads the client route tree from [front-end/src/app/client/client.routes.ts](../../front-end/src/app/client/client.routes.ts)
- `admin` loads the admin route tree from [front-end/src/app/admin/admin.routes.ts](../../front-end/src/app/admin/admin.routes.ts)

The app also redirects the empty path to the client area, which means the default entry is the public client-facing website.

## Route ownership

The major UI domains are split by audience:

- Client area: [front-end/src/app/client/client.routes.ts](../../front-end/src/app/client/client.routes.ts#L1-L46)
- Admin area: [front-end/src/app/admin/admin.routes.ts](../../front-end/src/app/admin/admin.routes.ts#L1-L30)

The client routes guard access to circuits, profile, reservations, and PayPal pages via the auth guard described in [frontend/routing-and-guards.md](routing-and-guards.md). The admin routes are not guarded here and expose dashboard, clients, reservations, and trip management screens directly.

## User-facing components and flows

The frontend includes two principal user journeys:

1. Client journey
   - Home page under [front-end/src/app/client/website/home/home.component.ts](../../front-end/src/app/client/website/home/home.component.ts)
   - Circuit browsing and detail under [front-end/src/app/client/circuits/circuits.component.ts](../../front-end/src/app/client/circuits/circuits.component.ts) and [front-end/src/app/client/circuits/circuit-detail/circuit-detail.component.ts](../../front-end/src/app/client/circuits/circuit-detail/circuit-detail.component.ts)
   - Reservation list and create screens under [front-end/src/app/client/reservations/reservation-list/reservation-list.component.ts](../../front-end/src/app/client/reservations/reservation-list/reservation-list.component.ts) and [front-end/src/app/client/reservations/reservation-create/reservation-create.component.ts](../../front-end/src/app/client/reservations/reservation-create/reservation-create.component.ts)
   - Payment flow under [front-end/src/app/client/payment/paypal-payment/paypal-payment.component.ts](../../front-end/src/app/client/payment/paypal-payment/paypal-payment.component.ts) and [front-end/src/app/client/payment-success/payment-success.component.ts](../../front-end/src/app/client/payment-success/payment-success.component.ts)

2. Admin journey
   - Dashboard, clients, reservations, and trips under the admin folder tree inside [front-end/src/app/admin](../../front-end/src/app/admin)

## Services used by the UI

The Angular services map directly to the backend API boundaries:

- [front-end/src/app/services/auth.service.ts](../../front-end/src/app/services/auth.service.ts#L7-L68) handles login, logout, and session checks against `/api/auth` and `/api/clients/profile`.
- [front-end/src/app/services/circuit.service.ts](../../front-end/src/app/services/circuit.service.ts) provides circuit queries and catalog operations.
- [front-end/src/app/services/reservation.service.ts](../../front-end/src/app/services/reservation.service.ts) is the client-side API wrapper for reservation creation and listing.
- [front-end/src/app/services/paypal.service.ts](../../front-end/src/app/services/paypal.service.ts) is the PayPal integration service used by the payment components.

## Validation and evidence

The repository has a baseline Angular app test in [front-end/src/app/app.spec.ts](../../front-end/src/app/app.spec.ts#L1-L19). It verifies that the app component is created and renders a default title string. That is a smoke test, not a full coverage test of the app’s route boundaries.

The practical frontend validation command is:

```bash
cd front-end && npm run build
```

For route-level verification, the more meaningful check is still the end-to-end runtime flow between the browser, the auth guard, and the backend session cookie. 
