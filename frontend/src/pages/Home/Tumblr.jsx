import React from "react";
import Plx from "react-plx";
import { Link } from 'react-router-dom';

import { Container, Card, Row, Col, Button, Image } from 'react-bootstrap';


const exampleParallaxData = [
  {
    start: "self",
    duration: '150vh',
    properties: [
      {
        startValue: 0.8,
        endValue: 1,
        property: "scale",
        easing: "ease-in"
      },
      {
        startValue: 1,
        endValue: 0.5,
        property: "opacity"
      }
    ]
  }
];

const headingParalaxData = [
  {
    start: "self",
    duration: "100vh",
    properties: [
      {
        startValue: 50,
        endValue: 100,
        property: "translateY"
      },
      {
        startValue: 0,
        endValue: 1,
        property: "opacity"
      }
    ]
  }
];


export const Tumblr = () => {
  return (
    <div style={{ position: "relative", backgroundColor: 'black' }}>
      <Plx
        style={{
          width: "80%",
          position: "absolute",
          top: "25%",
          marginLeft: "10%",
          textAlign: "center",
          zIndex: 2
        }}
        parallaxData={headingParalaxData}
      >
        <div className="text-container">
          <h1 className="custom-h1">AlpineVision</h1>
          <p className="intro-text">Alla ricerca di ciò che ami</p>
          <Row className="justify-content-center m-0">
            <Col xs="auto">
              <Button  as={Link} to="/blog" className="custom-button btn-outline-light btn-lg mt-5">
                <div id="explore-text">Blog</div>
              </Button>
            </Col>
            <Col xs="auto">
              <Button  as={Link} to="/products" className="custom-button btn-outline-light btn-lg mt-5">
                <div id="explore-text">Acquista ora</div>
              </Button>
            </Col>
          </Row>
        </div>
      </Plx>
      <Plx
        id="blurImage"
        parallaxData={exampleParallaxData}
        className="blur-plx"
      >
        <div className="background-image" />
      </Plx>
    </div>
  );
};
