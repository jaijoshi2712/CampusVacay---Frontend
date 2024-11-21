import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import { FaBed, FaCouch, FaShower, FaUtensils, FaWifi, FaSnowflake, FaTv, FaSuitcaseRolling } from 'react-icons/fa';
import './edits.css';
import { Navigation } from 'lucide-react';

const Header = () => {
  const [token, setToken] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const url = `http://3.16.159.54/student/api/logout/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify(''),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || JSON.stringify(responseData) || 'Logout failed');
      }

      setMessage({ type: 'success', content: 'Logout successful!' });
      localStorage.removeItem('authToken');
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
      setMessage({ type: 'error', content: error.message });
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-3xl font-bold text-blue-700 flex items-center no-underline">
          <Navigation className="mr-2" />
          CampusVacay.
        </a>
        <nav className="hidden md:flex space-x-8 text-lg">
          {['Home', 'Hotels', 'Rooms', 'About', 'Contact'].map((item) => (
            <li key={item} className="list-none text-gray-600 hover:text-blue-700 cursor-pointer transition duration-300">
              {item}
            </li>
          ))}
        </nav>
        {token ? (
          <button onClick={handleLogout} className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
            Logout
          </button>
        ) : (
          <a href="/login" className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition duration-300">
            Login
          </a>
        )}
      </div>
      {message.content && (
        <div className={`fixed top-16 right-8 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.content}
        </div>
      )}
    </header>
  );
};

const HotelDetailsContent = ({ roomSectionRef }) => {
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
                src="https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg"
                alt="Hotel Main"
                className="img-main"
              />
            </div>
          </Col>
          <Col lg={4}>
            <div className="side-images">
              <img
                src="https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
                alt="Hotel Room"
                className="img-side mb-3"
              />
              <img
                src="https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg"
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
                <Button
                  className="book-now-btn"
                  onClick={() => roomSectionRef.current.scrollIntoView({ behavior: 'smooth' })}
                >
                  Book Now!
                </Button>
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
              { icon: <FaTv />, text: '2 television' },
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


const RoomTypesSection = React.forwardRef((_, ref) => {
  const [roomsSelected, setRoomsSelected] = useState({});

  const handleRoomChange = (roomId, change) => {
    setRoomsSelected((prevState) => {
      const updatedCount = (prevState[roomId] || 0) + change;
      return updatedCount >= 0 ? { ...prevState, [roomId]: updatedCount } : prevState;
    });
  };

  const roomData = [
    {
      id: 1,
      name: 'Deluxe Room',
      description: 'A spacious deluxe room with sea view and luxurious amenities.',
      maxOccupancy: 2,
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
    },
    {
      id: 2,
      name: 'Suite',
      description: 'A luxurious suite with a private balcony and modern facilities.',
      maxOccupancy: 3,
      image: 'https://images.pexels.com/photos/271631/pexels-photo-271631.jpeg',
    },
    {
      id: 3,
      name: 'Standard Room',
      description: 'A cozy standard room perfect for a short stay.',
      maxOccupancy: 2,
      image: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
    },
  ];

  return (
    <section ref={ref} className="room-types-section py-6 bg-light">
      <Container>
        <h2 className="text-center mb-4">Room Types</h2>
        <Row>
          {roomData.map((room) => (
            <Col md={4} className="mb-4" key={room.id}>
              <Card className="equal-height-card">
                <div className="image-container">
                  <Card.Img variant="top" src={room.image} alt={room.name} className="room-image" />
                </div>
                <Card.Body>
                  <h5>{room.name}</h5>
                  <p>{room.description}</p>
                  <p className="text-muted">Max Occupancy: {room.maxOccupancy} people</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="room-controls">
                      <Button variant="outline-primary" onClick={() => handleRoomChange(room.id, -1)}>
                        -
                      </Button>
                      <span className="mx-2">{roomsSelected[room.id] || 0}</span>
                      <Button variant="outline-primary" onClick={() => handleRoomChange(room.id, 1)}>
                        +
                      </Button>
                    </div>
                    <Button variant="primary" disabled={!roomsSelected[room.id]}>
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
});


const Footer = () => (
  <footer className="bg-gray-800 text-gray-200 py-6">
    <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-start">
      <div className="w-full md:w-1/3 mb-4 md:mb-0">
        <a href="#home" className="text-3xl font-bold text-blue-500 flex items-center mb-2 no-underline">
          <Navigation className="mr-2" />
          CampusVacay.
        </a>
        <p className="text-gray-400 text-sm">We kaboom your beauty holiday instantly and memorable.</p>
      </div>
      <div className="w-full md:w-1/3 text-right">
        <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>Phone: +1-234-567-890</li>
          <li>Email: support@campusvacay.com</li>
          <li>Address: 123 Vacation Lane, Dream City, Holiday State</li>
        </ul>
      </div>
    </div>
  </footer>
);

const CopyrightBar = () => (
  <div className="bg-[#3252DF] text-white h-11 flex items-center justify-center text-center text-sm">
    <p>&copy; {new Date().getFullYear()} CampusVacay. All rights reserved.</p>
  </div>
);

const HotelDetails = () => {
  const roomSectionRef = useRef(null);

  return (
    <>
      <Header />
      <div className="hotel-details-content">
        <HotelDetailsContent roomSectionRef={roomSectionRef} />
        <RoomTypesSection ref={roomSectionRef} />
      </div>
      <Footer />
      <CopyrightBar />
    </>
  );
};

export default HotelDetails;