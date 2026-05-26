# Hotel Booking Management System

A full-stack hotel booking management system built with Node.js, Express, MongoDB, React, and PrimeReact.

## Prerequisites

- Node.js v18+
- MongoDB v6+ (running locally or a connection string)
- npm or yarn

## Project Structure

```
hotelBooking/
├── backend/          # Express + MongoDB API
└── frontend/         # React + PrimeReact UI
```

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd hotelBooking
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel_booking
```

### 3. Seed the Database

```bash
npm run seed
```

This populates the database with sample states, cities, users, hotels, and bookings.

### 4. Start the Backend

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 5. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`.

---

## API Documentation

### Base URL
`http://localhost:5000/api`

---

### Users

#### GET `/users/getUserList`

Fetch users with pagination, filtering, and sorting.

**Query Parameters:**

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| search    | string | Search in name, email, phone         |
| page      | number | Page number (default: 1)             |
| limit     | number | Records per page (default: 10)       |
| sortBy    | string | Field to sort by (default: createdAt)|
| sortOrder | string | `asc` or `desc` (default: desc)      |

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": { "total": 10, "page": 1, "limit": 10, "pages": 1 }
}
```

---

### Hotels

#### GET `/hotels/getHotelList`

Fetch hotels with pagination, filtering, and sorting.

**Query Parameters:**

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| search    | string | Search in hotel name                 |
| state     | string | Filter by state                      |
| city      | string | Filter by city                       |
| rating    | number | Filter by rating (1-5)               |
| status    | string | `active` or `inactive`               |
| page      | number | Page number (default: 1)             |
| limit     | number | Records per page (default: 10)       |
| sortBy    | string | Field to sort by                     |
| sortOrder | string | `asc` or `desc`                      |

---

### Bookings

#### GET `/bookings/getBookings`

Fetch bookings with user and hotel details.

**Query Parameters:**

| Parameter | Type    | Description                              |
|-----------|---------|------------------------------------------|
| userId    | string  | Filter by user ID                        |
| hotelId   | string  | Filter by hotel ID                       |
| status    | number  | 0=Confirmed, 1=Cancelled, 2=Completed    |
| fromDate  | string  | Check-in date range start (YYYY-MM-DD)   |
| toDate    | string  | Check-in date range end (YYYY-MM-DD)     |
| page      | number  | Page number                              |
| limit     | number  | Records per page                         |
| sortBy    | string  | Field to sort by                         |
| sortOrder | string  | `asc` or `desc`                          |
| download  | boolean | Set to `true` to export as Excel file    |

#### POST `/bookings/createBooking`

Create a new booking.

**Request Body:**
```json
{
  "userId": "string",
  "hotelId": "string",
  "checkinDate": "2025-08-15",
  "guestCount": 2,
  "requirements": "High floor room preferred"
}
```

**Validation Rules:**
- All fields except `requirements` are required
- Cannot book for next day after 9 PM
- No duplicate booking for same hotel on the same day (per user)
- Default status is `CONFIRMED (0)`

#### POST `/bookings/:bookingId/cancel`

Cancel an existing booking.

---

### Location

#### GET `/state`

Returns all states.

#### GET `/city`

Returns cities, optionally filtered by state.

**Query Parameters:**

| Parameter | Type   | Description                |
|-----------|--------|----------------------------|
| state     | string | Filter cities by state name |

---

## Booking Status Codes

| Code | Label     |
|------|-----------|
| 0    | Confirmed |
| 1    | Cancelled |
| 2    | Completed |

---

## Environment Variables

See `backend/.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel_booking
```
