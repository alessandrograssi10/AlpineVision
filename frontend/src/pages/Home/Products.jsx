import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Home.css'; // Assuming you have custom styles in this CSS file
import Mask from '../../assets/Images/MasckeraFiga.png';
import Mask2 from '../../assets/Images/MascheraCarinaGialla.png';
import Mask3 from '../../assets/Images/MascheraOraSiCheCiSiamo.png';
import Mask4 from '../../assets/Images/QuestaSiCheèUnaMaschera.png';
import Uomo from '../../assets/AboutUsPhoto/uomoConMascheraImpegnato.webp'

const products = [
  {
    name: 'EternalPeak',
    price: '250,90 €',
    imageUrl: Mask, // Replace with actual image paths
    link: '../product/6643e4730d230b04cd730616'
  },
  {
    name: 'SnowSentry',
    price: '86,90 €',
    imageUrl: Mask2,
    link: '../product/66435fa99b98ac33f5ef2b30'
  },
  {
    name: 'EternalSpirit',
    price: '189,00 €',
    imageUrl: Mask3,
    link: '../product/66436a2d9b98ac33f5ef2b3a'
  },
  {
    name: 'EternalGlide',
    price: '89,90 €',
    imageUrl: Mask4,
    link: '../product/6643e6920d230b04cd730618'
  },
  // Add more products as needed
];

const ProductCard = ({ product }) => (
  <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
    <Link to={product.link} style={{ textDecoration: 'none', width: '100%' }}>
      <Card className="m-3 border-0 h-100">
        <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
          <Card.Img
            variant="top"
            src={product.imageUrl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text style={{ marginTop: '0.5rem' }}>{product.price}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  </Col>
);

export const Products = () => {
  return (
    <Container fluid className="p-0 m-0 mt-5">
      <Row className="m-0 p-0 w-100 mb-5" style={{ height: 'auto', minHeight: '80vh' }}>
        <Col xs={12} className="m-0 p-0">
          <h2 className="text-center my-4">Trend della settimana</h2>
        </Col>
        <Row className="w-100 m-0 p-0">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </Row>
      </Row>
      <Row className="m-0 p-0 w-100">
        <Col xs={12} className="p-0">
          <img
            src={Uomo}
            alt="mask"
            className="img-fluid"
            style={{ width: '100%', height: 'auto', transform: 'scale(1.1)' }}
          />
        </Col>
      </Row>
    </Container>
  );
};