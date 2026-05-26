# Hotel Booking Management

A hotel booking system with three modules — Users, Hotels, and Bookings. Built with Node.js + MongoDB on the backend and React + PrimeReact on the frontend.

## Tech Stack

**Backend** — Node.js, Express, MongoDB, Mongoose, excel4node  
**Frontend** — React 18, Vite, PrimeReact, React Router, Axios

## Project Structure

```
hotelBooking/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   └── .env.example
└── frontend/
    └── src/
        ├── components/
        │   ├── ReusableTable.jsx
        │   └── ReusableFilter.jsx
        ├── pages/
        │   ├── Users.jsx
        │   ├── Hotels.jsx
        │   └── Bookings.jsx
        └── services/
            └── api.js
```

## Prerequisites

- Node.js v18+
- MongoDB v7 (local or Docker)
- npm

## Getting Started

### 1. Clone

```bash
git clone https://github.com/sumit-verma11/Hotel-booking-management.git
cd Hotel-booking-management
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and update if needed:

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/hotel_booking
```

> **Note:** On macOS, port 5000 is reserved by AirPlay Receiver (Control Center). Use 5001 or any other free port.

Seed the database with sample data:

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

API runs at `http://localhost:5001`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

The Vite dev server proxies all `/api` requests to the backend automatically.

---

## API Reference

Base URL: `http://localhost:5001/api`

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/getUserList` | List users with search, pagination, sorting |

Query params: `search`, `page`, `limit`, `sortBy`, `sortOrder`, `bookedOnly`

---

### Hotels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hotels/getHotelList` | List hotels with filters, pagination, sorting |

Query params: `search`, `state`, `city`, `rating`, `status`, `page`, `limit`, `sortBy`, `sortOrder`

---

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings/getBookings` | List bookings with populated user & hotel |
| POST | `/bookings/createBooking` | Create a new booking |
| POST | `/bookings/:bookingId/cancel` | Cancel a booking |

**GET params:** `userId`, `hotelId`, `status`, `fromDate`, `toDate`, `page`, `limit`, `sortBy`, `sortOrder`, `download`

Pass `download=true` to export filtered results as an Excel file.

**POST createBooking body:**
```json
{
  "userId": "<ObjectId>",
  "hotelId": "<ObjectId>",
  "checkinDate": "2025-08-15",
  "guestCount": 2,
  "requirements": "Sea view room"
}
```

Booking rules enforced:
- After 9 PM, bookings cannot be made for the next day
- A user cannot have two active bookings at the same hotel on the same date
- Newly created bookings default to `CONFIRMED` status

---

### Location

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/state` | All states |
| GET | `/city` | All cities, or filtered by `?state=Maharashtra` |

---

## Booking Status

| Value | Meaning |
|-------|---------|
| 0 | Confirmed |
| 1 | Cancelled |
| 2 | Completed |

---

## Seed Data

Running `npm run seed` loads:

- 8 Indian states
- 17 cities
- 10 users
- 15 hotels (mix of active/inactive, ratings 3–5, across different states)
- 12 bookings (mix of confirmed, cancelled, completed)

---

## Environment Variables

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/hotel_booking
```
