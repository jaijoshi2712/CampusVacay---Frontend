
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import SearchPage from './components/pages/SearchPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import HotelRegister from './components/pages/HotelRegister';
import DashboardPage from './components/pages/DashboardPage';
import StudentDashboardPage from './components/pages/StudentDashboardPage';


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
      </Routes>
    </Router>
  );
}

export default App;