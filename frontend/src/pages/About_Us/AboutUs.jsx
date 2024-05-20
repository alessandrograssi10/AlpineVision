import React, { useState, useEffect } from 'react';
import Plx from 'react-plx';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './AboutUs.css'; // Ensure your styles are set up correctly
import backgroundImage from '../../assets/AboutUsPhoto/uomoCheSaltaConScii.jpg'; // Ensure this path is correct
import happyTeam from '../../assets/AboutUsPhoto/team.jpg'; // Correct the image path and extension
import Matteo from '../../assets/AboutUsPhoto/matteo.png';
import Alessandro from '../../assets/AboutUsPhoto/alessandro.png';
import Gianluca from '../../assets/AboutUsPhoto/Gianluca.png';
import Alessio from '../../assets/AboutUsPhoto/alessio.png';
import chalet from '../../assets/AboutUsPhoto/chalet.jpg';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function AboutUs() {

  const position = [41.8902, 12.4922];
  const parallaxData = [
    {
      start: 'self',
      duration: 300,
      properties: [
        {
          startValue: -100, // Il valore di partenza, fuori dallo schermo a sinistra
          endValue: 0,      // Il valore di arrivo, centro dello schermo
          property: 'translateX', // Proprietà CSS per spostare l'elemento sull'asse X
          unit: '%' // L'unità di misura
        }
      ]
    }
  ];
  
    const parallaxDataText = [
        {
            start: 0,
            duration: 600, // Duration of the effect as the user scrolls
            properties: [
                {
                    startValue: 0.85,
                    endValue: 0.5,
                    property: "opacity",
                }
            ],
        },
    ];

    const parallaxDataBackground = [
        {
            start: 0,
            duration: 100,
            properties: [
                {
                    startValue: -50,
                    endValue: 0,
                    property: "translateY",
                }
            ],
        }
    ];

  

    const coreValues = [
      { title: "Trust", description: "Rafforziamo la vostra fiducia dedicandovi la massima disponibità garantendo un' assistenza di 24 ore al giorno 7 giorni a settimana.", parallaxData: { start: 0, end: 500, properties: [{ startValue: -20, endValue: 20, property: "translateY" }, { startValue: 0, endValue: 1, property: "opacity" }] } },
      { title: "Innovation", description: "Siamo pionieri delle tecnologie future. I nostri esperti si aggiornano costantemente per adattare ai nostri prodotti le ultime migliorie del settore.", parallaxData: { start: 0, end: 600, properties: [{ startValue: -20, endValue: 20, property: "translateY" }, { startValue: 0, endValue: 1, property: "opacity" }] } },
      { title: "Safety", description: "I nostri prodotti garantiscono una vera e completa protezione al sole del 90% più efficace di ogni altro prodotto.", parallaxData: { start: 300, end: 500, properties: [{ startValue: -20, endValue: 20, property: "translateY" }, { startValue: 0, endValue: 1, property: "opacity" }] } },
      { title: "Quality", description: "La nostra non si discute. Abbiamo numerosi ingegneri che testano giornalmente l'usabilità, il comfort e la durabilità dei nostri prodotti.", parallaxData: { start: 300, end: 600, properties: [{ startValue: -20, endValue: 20, property: "translateY" }, { startValue: 0, endValue: 1, property: "opacity" }] } }
  ];
  const teamMembers = [
    { name: "Matteo", role: "Product Manager", image: Matteo },
    { name: "Alessandro", role: "Technical Lead", image: Alessandro },
    { name: "Gianluca", role: "Marketing Director", image: Gianluca },
    { name: "Alessio", role: "Chief Executive Officer", image: Alessio }
];

return (
    <>
        <Plx className="teamParallax" parallaxData={parallaxDataText} style={{alignItems:'center', backgroundImage: `url(${happyTeam})` }}>
  <h1 className="display-2 display-1-md display-1-sm" style={{fontWeight: '500'}}>UN TEAM DI PROFESSIONISTI</h1>
</Plx>
    <Plx className="backgroundParallax" parallaxData={parallaxDataBackground} style={{ backgroundImage: `url(${backgroundImage})` }}>
    <Container>
    <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}> 
        {coreValues.map((value, index) => (
            <Col key={index} xs={6} className="mb-4"> {/* This will put two cards per row on all screen sizes */}
                <Plx className="valueBox" parallaxData={[value.parallaxData]}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <Card.Title>{value.title}</Card.Title>
                            <Card.Text>{value.description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Plx>
            </Col>
        ))}
    </Row>
</Container>

</Plx>


<div className="backgroundParallax">
    <Container>
        <Plx parallaxData={parallaxData}>
        <h1 className="text-center mb-4">Il nostro Team</h1>
        </Plx>
        <Row className="justify-content-center">
            {teamMembers.map((member, index) => (
                <Col key={index} xs={6} md={3} className="mb-4">
                    <div className="teamMember card bg-transparent text-white text-center">
                        <img src={member.image} alt={member.name} className="img-fluid rounded-circle" style={{ width: '100px', height: '100px' }} />
                        <div className="card-body">
                            <h3 className="card-title">{member.name}</h3>
                            <p className="card-text">{member.role}</p>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    </Container>
</div>

<Container className="mt-4 mb-4">
                <Plx parallaxData={parallaxData}>
                <h2 className="text-center">Dove trovarci</h2>
                </Plx>
                
                <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '450px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                    <Popup>
                      <div>
                          <img src={chalet} alt="Chalet Image" style={{ width: '100%', height: 'auto' }} />
                          <p>Our beautiful factory!</p>
                      </div>
                    </Popup>
                    </Marker>
                </MapContainer>
                <p>Via dei Fori Imperiali, 10</p>
            </Container>
    </>
);
}

export default AboutUs;
