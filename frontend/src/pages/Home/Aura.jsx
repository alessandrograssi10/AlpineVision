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
        
        <Row className="p-0 m-0 bg-black">
                <h2 style={{color: 'white', margin: '3vh',alignItems: 'center'}}>Eternal Aura</h2>
        </Row>
         <Row className="m-0 p-0 bg-black">
ù           <Plx parallaxData={zoomOut} >
                <img src={Mask} className="img-aura" alt="mask" style={{ position: 'relative', zIndex: 1 }} />
            </Plx>
            
        </Row>
        <Row className="justify-content-center bg-black m-0">
            <Col xs={12} className="d-flex justify-content-center align-items-center pb-5">
                <Button id="explore-btn" as={Link} to="/product/664367419b98ac33f5ef2b38" className="button btn-outline-light btn-lg mt-5">
                    <div id="explore-text">Acquista ora</div>
                </Button>
            </Col>
        </Row>
    </>
    );
}