import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Users from './pages/Users';
import Hotels from './pages/Hotels';
import Bookings from './pages/Bookings';

const pageTitles = {
  '/users': 'Users',
  '/hotels': 'Hotels',
  '/bookings': 'Bookings'
};

export default function App() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Hotel Booking';

  return (
    <PrimeReactProvider>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h2>
              <i className="pi pi-building" />
              Hotel <span>Booking</span>
            </h2>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/users" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <i className="pi pi-users" />
              Users
            </NavLink>
            <NavLink to="/hotels" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <i className="pi pi-building" />
              Hotels
            </NavLink>
            <NavLink to="/bookings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <i className="pi pi-calendar" />
              Bookings
            </NavLink>
          </nav>
        </aside>

        <div className="main-content">
          <header className="topbar">
            <h1>{title}</h1>
          </header>
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/users" element={<Users />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </main>
        </div>
      </div>
    </PrimeReactProvider>
  );
}
