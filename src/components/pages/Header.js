import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './edits.css';


const Header = () => (
  <Navbar expand="lg" className="header fixed-top">
    <Container>
      <Navbar.Brand href="/" className="logo">
        <span className="logo-part1">Campus</span>
        <span className="logo-part2">Vacay.</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto align-items-center">
          <Nav.Link href="/" className="nav-link active">Home</Nav.Link>
          <Nav.Link href="/hotels" className="nav-link">Hotels</Nav.Link>
          <Nav.Link href="/rooms" className="nav-link">Rooms</Nav.Link>
          <Nav.Link href="/about" className="nav-link">About</Nav.Link>
          <Nav.Link href="/contact" className="nav-link">Contact</Nav.Link>
          <a href="/login" className="btn btn-primary login-btn ms-3">
            Login
          </a>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;
