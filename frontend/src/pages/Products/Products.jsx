import React, { useState } from 'react';
import { Image,Container, Row, Form, Col, Carousel, Button } from 'react-bootstrap';
import Immagine from '../../assets/Images/mc.png';
import './Products.css';

export const Products = () => {
    return (
        <Container fluid className="p-0">
            <Row className="ml-0 mr-0 no-space-row">
        <div style={{ backgroundColor: 'white', height: '50px' }}></div>

        <Col style={{ position: "absolute" }}className="text-center m-0 bg-white text-black p-3">
            <h3 className='motto2'>Prodotti</h3>
          </Col>
        <Image src={Immagine} className="img-fluid-no-space m-0 p-0" />

        </Row>
        </Container>
    );
};
