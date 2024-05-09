import React from 'react';
import Immagine from '../../assets/Images/mask.png';
import Immagine2 from '../../assets/Images/maskL.png';
import Immagine3 from '../../assets/Images/col2.png';
import Immagine4 from '../../assets/Images/Bg.png';
import Immagine5 from '../../assets/Images/m3.png';
import Immagine6 from '../../assets/Images/mc.png';
import { Link } from 'react-router-dom';
import { Container,Card, Row, Col, Button, Image } from 'react-bootstrap';

import './Home.css';
//            <h2>La vetta è solo l'inizio.</h2>

export const Home = () => {
    return (
      <Container fluid className="p-0 m-0 ">
        <Row className="ml-0 mr-0 no-space-row">
        <div style={{ backgroundColor: 'white', height: '50px' }}></div>

        <Col style={{ position: "absolute" }}className="text-left m-0 bg-white text-black p-3">
            <h3 className='motto'>Ogni discesa racconta una nuova storia.</h3>
          </Col>
        <Image src={Immagine4} className="img-fluid-no-space" />

        </Row>
        <Row className="m-0 no-space-row">
          <div style={{ backgroundColor: 'black', height: '5px' }}></div>

          <Col className="text-center bg-black text-white p-3">
            <div style={{ backgroundColor: 'black', height: '50px' }}></div>
            <h1 className="custom-h1">Eternal Aura</h1>
          </Col>
        </Row>
        
        <Row className="m-0 no-space-row">
          <Col className="p-0 m-0">
            <Image src={Immagine} className="img-fluid-no-space" />
          </Col>
        </Row>
        <Row className="justify-content-center  bg-black m-0 ">
          <Col xs={12} className="d-flex justify-content-center align-items-center pb-5">
          <Button id="explore-btn" as={Link} to="/EternalAura" className=" button btn-outline-light btn-lg mt-5">
    <div id="explore-text">Acquista ora</div>
</Button>

  
          </Col>
        </Row>
        <Row>       
           <Image src={Immagine5} className="img-fluid-no-space w-100 h-100" />
        </Row>

        <Row className="m-0 ">
          <div style={{ backgroundColor: 'white', height: '50px' }}></div>

          <Col className="text-center bg-white text-black p-5">
            <h2>Design moderno abbinato alla forza dei materiali durevoli</h2>
          </Col>
          <div style={{ backgroundColor: 'white', height: '25px' }}></div>

        </Row>
        <Row className="align-items-center">
          <Col md={8}>
            <Image src={Immagine2} fluid />
          </Col>
          <Col md={4} className="text-center px-5">
            <h4>La nostra maschera da sci combina la robustezza del policarbonato termoplastico con la flessibilità del nylon, offrendo massima protezione e comfort duraturo, perfettamente adattabile e resistente alle basse temperature.</h4>
          </Col>

        </Row>
        <div style={{ backgroundColor: 'white', height: '100px' }}></div>

        <Row>       
           <Image src={Immagine6} className="img-fluid-no-space w-100 h-100" />
        </Row>
        <Row className="m-0 ">
          <div style={{ backgroundColor: 'black', height: '50px' }}></div>

          <Col className="text-center bg-black text-white p-5">
            <h2>Visione cristallina, protezione assoluta</h2>
          </Col>
          <div style={{ backgroundColor: 'black', height: '25px' }}></div>

        </Row>
        
        <Row className="align-items-center text-white  bg-black">
          <Col md={4} className="text-center px-5  ">
            <h4>Le nostre lenti sono dotate di una gamma di colori vivaci e selettivi, ottimizzate per migliorare il contrasto e la percezione della profondità in varie condizioni di luce. Questa tecnologia cromatica avanzata assicura una visione chiara e dettagliata, permettendo agli sciatori di leggere il terreno con precisione e sicurezza.</h4>
          </Col>
          <Col md={8}>
            <Image src={Immagine3} fluid />
          </Col>

        </Row>
        <div style={{ backgroundColor: 'black', height: '100px' }}></div>
        <Row>       
           <Image src={Immagine5} className="img-fluid-no-space w-100 h-100" />
        </Row>
        <Row className="m-0 ">
          <div style={{ backgroundColor: 'white', height: '50px' }}></div>

          <Col className="text-center bg-white text-black p-5">
            <h2>Scopri i nostri prodotti di punta</h2>
          </Col>
          <div style={{ backgroundColor: 'white', height: '25px' }}></div>

        </Row>
        <Row className="align-items-center">
          <Container fluid style={{ overflowX: 'auto' }} className="d-flex">
            <Card style={{ width: '18rem', flex: 'none', marginRight: '15px' }}>
              <Card.Img variant="top" src="path/to/your/image.jpg" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>

            {/* Ripeti il componente <Card> per altri prodotti */}
            <Card style={{ width: '18rem', flex: 'none', marginRight: '15px' }}>
              <Card.Img variant="top" src="path/to/your/another-image.jpg" />
              <Card.Body>
                <Card.Title>Another Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
            {/* Ripeti il componente <Card> per altri prodotti */}
            <Card style={{ width: '18rem', flex: 'none', marginRight: '15px' }}>
              <Card.Img variant="top" src="path/to/your/another-image.jpg" />
              <Card.Body>
                <Card.Title>Another Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
            {/* Ripeti il componente <Card> per altri prodotti */}
            <Card style={{ width: '18rem', flex: 'none', marginRight: '15px' }}>
              <Card.Img variant="top" src="path/to/your/another-image.jpg" />
              <Card.Body>
                <Card.Title>Another Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
                  </Container>
                </Row>
                <div style={{ backgroundColor: 'white', height: '100px' }}></div>


                <Row className="m-0 ">
                  <div style={{ backgroundColor: 'black', height: '50px' }}></div>

                  <Col className="text-center bg-black text-white p-5">
                  <h2>Scendere in Sicurezza: L'Importanza Cruciale delle Maschere da Sci</h2>
                  </Col>
                  <div style={{ backgroundColor: 'black', height: '25px' }}></div>

                </Row>
                <Row className="align-items-center text-white  bg-black">
                  <Col md={12} className="text-center px-5  ">
                  <h4>Le maschere da sci non sono solo un accessorio di stile; sono una barriera critica contro gli elementi. Offrono protezione dai raggi UV, che sono significativamente più intensi nelle altitudini elevate, riducendo il rischio di danni agli occhi. Inoltre, salvaguardano da vento, neve e detriti, garantendo che gli sciatori possano mantenere una visione chiara della pista davanti a loro.</h4>
                  </Col>
                </Row>
                <div style={{ backgroundColor: 'black', height: '100px' }}></div>

                <Row className="justify-content-center bg-black m-0 ">
                  <Col xs={12} className="d-flex justify-content-center align-items-center pb-5">
                  <Button variant="outline-light" size="lg" href="/Blog" className=" button btn-outline-light btn-lg mt-5" >Esplora il Blog Ora</Button>
                  
                  </Col>
                </Row>
                <div style={{ backgroundColor: 'black', height: '100px' }}></div>
                </Container>
              );
}
