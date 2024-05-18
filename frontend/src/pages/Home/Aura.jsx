import React from "react";
import Mask from '../../assets/Images/mask.png';
import Plx from 'react-plx';
import { Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Image } from 'react-bootstrap';

export const Aura = () => {
    const zoomOut = [
        {
          start: 'self',
          end: 600,
          properties: [
            {
              startValue: 0.6,
              endValue: 0.8,
              property: 'scale',
            },
          ],
        },
      ];
    return (
        <>
       <Row className="p-0 m-0 bg-black" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <h1 style={{color: 'white', margin: '5vh',marginTop: '10vh'}}>Eternal Aura</h1>
      </Row>
      
      <Row className="m-0 p-0 w-100 bg-black">
        <Plx parallaxData={zoomOut}>

          <img
            src={Mask}
            alt="mask"
            style={{ width: '100%', height: 'auto', position: 'relative', zIndex: 1, transform: 'scale(1.1)' }}
          />
        </Plx>

      </Row>

      <Row className="justify-content-center m-0 bg-black d-flex">
      <Col xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
        <Button 
          as={Link} 
          to="/product/664367419b98ac33f5ef2b38" 
          className="custom-button btn-lg btn-md m-5"
        >
          <div id="explore-text">Acquista ora</div>
        </Button>
      </Col>
      </Row>

    </>
    );
}