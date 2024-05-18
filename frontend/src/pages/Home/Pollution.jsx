import React from "react";
import Plx from "react-plx";
import { Link } from 'react-router-dom';
import Poll from '../../assets/Video/Inqinamento.mp4'
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
        endValue: 0.6,
        property: "opacity",
        easing: "ease-in-out"
      }
    ]
  }
];

const headingParalaxData = [
  {
    start: "self",
    duration: "150vh",
    properties: [
      {
        startValue: 50,
        endValue: 100,
        property: "translateY"
      }
    ]
  }
];


export const Pollution = () => {
  return (
    <div style={{ position: "relative", backgroundColor: 'white' }}>
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
        <div className="text-container-video">
          <h1 className="custom-h1">Aiutaci a salvare il mondo</h1>
          <p className="intro-text-video">Parte dei nostri ricavi aiutano a ridurre le plastiche nell'ambiente</p>
         
        </div>
      </Plx>
      <Plx
        id="blurImage"
        parallaxData={exampleParallaxData}
        className="blur-plx"
      >
        <div className="background-video">
            <video src={Poll} autoPlay loop muted />
                
        </div>
      </Plx>
    </div>
  );
};
