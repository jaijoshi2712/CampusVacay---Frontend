import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import HotelRegister from './components/pages/HotelRegister';
import DashboardPage from './components/pages/DashboardPage';
import StudentDashboardPage from './components/pages/StudentDashboardPage';
import ReviewBooking from './components/pages/Review_Booking/ReviewBooking';
import BookingSuccess from './components/pages/Review_Booking/BookingSuccess';
import HotelDetails from './components/pages/HotelDetails';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/hotel" element={<HotelRegister />} />
        <Route path="/dashboard" element={<DashboardPage /> } />
        <Route path="/student/dashboard" element={<StudentDashboardPage /> } />
        <Route path="/review-booking" element={<ReviewBooking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/hotel-details" element={<HotelDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
