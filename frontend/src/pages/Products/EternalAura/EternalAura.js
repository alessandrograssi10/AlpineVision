import React, { useState } from 'react';
import { Container, Row, Form, Col, Carousel, Button } from 'react-bootstrap';
import Immagine3 from '../../../assets/Images/maskL.png';
import './EternalAura.css';

export const EternalAura = () => {
    const [selectedImage, setSelectedImage] = useState('');

    return (
        <Container fluid className="p-0">
            <Row className="d-flex align-items-stretch pt-5">
                <Col md={6} className="d-flex flex-column">
                    <Carousel className='carfix'>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={Immagine3}
                                alt="Prima immagine"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={Immagine3}
                                alt="Seconda immagine"
                            />
                        </Carousel.Item>
                    </Carousel>
                </Col>
                <Col md={6} className="white-panel d-flex flex-column justify-content-center">
                    <div className="shadow-box mx-auto">
                        <Row><h2 className="text-left text-black">ETERNAL AURA</h2></Row>
                        <Row><h4 className="text-left text-black">black</h4></Row>
                        <Row>
                            <div className="d-flex align-items-center">
                                {[Immagine3, Immagine3].map((imageSrc, index) => (
                                    <Form.Check 
                                        key={index}
                                        type="radio"
                                        id={`radio-${index}`}
                                        name="image-radio"
                                        className="image-radio-button"
                                        onChange={() => setSelectedImage(`radio-${index}`)}
                                        checked={selectedImage === `radio-${index}`}
                                        label=""
                                    >
                                        <label htmlFor={`radio-${index}`} className={`image-radio-label ${selectedImage === `radio-${index}` ? 'selected' : ''}`} style={{ backgroundImage: `url(${imageSrc})` }}></label>
                                    </Form.Check>
                                ))}
                            </div>
                        </Row>
                        <Row className="justify-content-center m-0">
                            <Col xs={12} className="d-flex justify-content-left align-items-center pb-5">
                                <Button variant="outline-dark" size="lg">Aggiungi al carrello</Button>
                                <div style={{ width: '10px' }}></div>
                                <Button href="/EternalAura" variant="outline-dark" size="lg">Compra ora</Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
            <div style={{ backgroundColor: 'white', height: '50px' }}></div>
            <Row className="m-0 no-space-row">
                <div style={{ backgroundColor: 'black', height: '50px' }}></div>
                <Col className="text-center bg-black text-white p-3">
                    <h2>Dai un occhiata da vicino.</h2>
                    <div style={{ backgroundColor: 'black', height: '50px' }}></div>
                </Col>
            </Row>
        </Container>
    );
};
