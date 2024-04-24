import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';


export const HeaderProducts = () => {


    const [productsMask, setProductsMask] = useState([]);
    const [productsGlass, setProductsGlass] = useState([]);
    const [imageUrlsp, setImageUrlsp] = useState({});


   
  
      
  
      
      



        return (
            <Row>
                <Col md={4} className="d-flex flex-column">
                    <h4>MASCHERE</h4>
                    <p>-Eternal Aura</p>
                    <p>-Ethereal Spirit</p>
                </Col>
                <Col md={4} className="d-flex flex-column">
                    <h4>OCCHIALI</h4>
                    <p>-Clarity Peaks</p>
                    <p>-Horizon Gaze</p>
                </Col>
            </Row>
    );
}

export default HeaderProducts;
