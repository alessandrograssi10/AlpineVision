import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} sm={12}>
            <h5>Chi Siamo</h5>
            <p>La tua fonte affidabile per attrezzature da sci di alta qualità, consigli esperti e storie appassionanti dal mondo dello sci.</p>
          </Col>
          <Col md={4} sm={12}>
            <h5>Link Utili</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Home</a></li>
              <li><a href="#" className="text-light">Prodotti</a></li>
              <li><a href="#" className="text-light">Blog</a></li>
              <li><a href="#" className="text-light">Contatti</a></li>
            </ul>
          </Col>
          <Col md={4} sm={12}>
            <h5>Contattaci</h5>
            <p>Via esempio 123, 45678 Città</p>
            <p>Email: info@example.com</p>
            <p>Telefono: +39 012 3456789</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            © 2024 Alpine Vision. Tutti i diritti riservati.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
