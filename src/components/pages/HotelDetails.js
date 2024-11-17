import React from 'react';
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import { FaBed, FaCouch, FaShower, FaUtensils, FaWifi, FaSnowflake, FaTv, FaSuitcaseRolling } from 'react-icons/fa';
import './edits.css';
import Header from './Header.js';

// Make sure you've imported Bootstrap CSS in your index.js or App.js
// import 'bootstrap/dist/css/bootstrap.min.css';

const HotelDetailsContent = () => {
  return (
    <div className="hotel-page">
      <Container className="hotel-container">
        {/* Breadcrumb */}
        <Row className="mb-4">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Hotel Details</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        {/* Hotel Title */}
        <Row className="mb-4">
          <Col className="text-center">
            <h1 className="hotel-title">Blue Origin Fams</h1>
            <p className="hotel-location">Galle, Sri Lanka</p>
          </Col>
        </Row>

        {/* Hotel Images */}
        <Row className="mb-5">
          <Col lg={8} className="mb-3 mb-lg-0">
            <div className="main-image-container">
              <img
                src="/images/65046bf150d1abb7e5911702_x-65046bcfdc4f0.webp"
                alt="Hotel Main"
                className="img-main"
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="side-images">
              <img
                src="/images/hotel-del-coronado-views-suite-K1TOS1-K1TOJ1_2500x1100.jpg.webp"
                alt="Hotel Room"
                className="img-side mb-3"
              />
              <img
                src="/images/ihgor-member-rate-web-offers-1440x720.avif"
                alt="Hotel Amenities"
                className="img-side"
              />
            </div>
          </Col>
        </Row>

        {/* Description and Booking */}
        <Row className="mb-5">
          <Col lg={8}>
            <div className="hotel-description">
              <h2 className="section-title">About the place</h2>
              <p>
                Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic that exploits the use of repetition and understated development. Minimal techno is thought to have been originally developed in the early 1990s by Detroit-based producers Robert Hood and Daniel Bell.
              </p>
            </div>
          </Col>
          <Col lg={4}>
            <Card className="booking-card">
              <Card.Body>
                <h3 className="booking-title">Start Booking</h3>
                <div className="price-info">
                  <span className="price">$200</span>
                  <span className="per-night">per Day</span>
                </div>
                <Button className="book-now-btn">Book Now!</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Amenities */}
        <div className="amenities-section">
          <Row>
            {[
              { icon: <FaBed />, text: '1 bedroom' },
              { icon: <FaCouch />, text: '1 living room' },
              { icon: <FaShower />, text: '1 bathroom' },
              { icon: <FaUtensils />, text: '1 dining room' },
              { icon: <FaWifi />, text: '10 mbp/s' },
              { icon: <FaSuitcaseRolling />, text: '7 unit ready' },
              { icon: <FaSnowflake />, text: '1 refrigerator' },
              { icon: <FaTv />, text: '2 television' }
            ].map((amenity, index) => (
              <Col key={index} xs={6} md={3} className="mb-4">
                <div className="amenity-item">
                  <span className="amenity-icon">{amenity.icon}</span>
                  <p className="amenity-text">{amenity.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

const HotelDetails = () => (
  <>
    <Header />
    <HotelDetailsContent />
  </>
);

export default HotelDetails;