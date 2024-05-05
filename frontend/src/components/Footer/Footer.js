import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4  mt-0">
      <Container>
        <Row>
          <Col md={4} sm={12}>
            <h5>SU DI NOI</h5>
            <p>Siamo un team di appassionati di Sci.
              Puoi trovarci sulle nostre pagine social:
              Alessandro Grassi, Gianluca De Mare, Alessio Cece, Matteo Giuliani.
            </p>
          </Col>
          <Col md={4} sm={12}>
            <h5>LINKS</h5>
            <ul className="list-unstyled">
              <li><a href="/home" className="text-light">Home</a></li>
              <li><a href="/Products" className="text-light">Prodotti</a></li>
              <li><a href="/Accessories" className="text-light">Accessori</a></li>
              <li><a href="/Blog" className="text-light">Blog</a></li>
              <li><a href="/Support" className="text-light">Chi Siamo</a></li>
            </ul>
          </Col>
          <Col md={4} sm={12}>
            <h5>CONTATTACI</h5>
            <p>Sapienza Università di Roma</p>
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
