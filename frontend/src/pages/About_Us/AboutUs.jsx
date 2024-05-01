import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutUs.css';
import Plx from 'react-plx';
import {useState, useEffect} from 'react';

function AboutUs() {

    const [viewPortWidth, setViewPortWidth] = useState(window.innerWidth);


    return (
        <Container id="mainContainer" className="rounded pt-3 pb-3 mt-4 mb-5 overflow-hidden">
            {/* bgC */}
            <Container className="pt-3 pb-4 bg-light rounded">
                {/* Problema-Soluzione */}
                <Container className='p-3 rounded introAV'>
                    <Row className='mb-5'>
                        {/* Immagine */}
                        <Col xs="12" md="6" className="d-flex justify-content-center">
                            <img className='rounded img-resizing' fluid src="https://images.unsplash.com/photo-1511608010928-2ef806fd3773?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </Col>
                        {/* Descrizione */}
                        <Col xs="12" md="6" className="text-center p-2">
                            <h1 className='mb-4'>Sapevi che la neve può riflettere fino all'80% della luce solare? </h1>
                            <p className='lead'>Alpine Vision realizza maschere da sci ed altri accessori che proteggono i tuoi occhi dai raggi solari, in questo modo puoi divertirti in sicurezza! </p>
                        </Col>
                    </Row>
                </Container>
                {/* Perchè scegliere Alpine Vision */}
                <Container className=' pt-3 pb-3 containerSpace'>
                    <Row>
                        <Col xs="12" md="6" className='text-center p-3 mb-5 overflow-hidden'>
                            <Plx
                                parallaxData={[
                                    {
                                        start: 0,
                                        end: 400,
                                        properties: [
                                            {
                                                startValue: 0,
                                                endValue: 1,
                                                property: "opacity"
                                            },
                                            {
                                                startValue: -250,
                                                endValue: 0,
                                                property: "translateX"
                                            }

                                        ]
                                    }
                                ]}>
                                <h1 className='mb-4'>Alpine Vision rispetta l'ambiente!</h1>
                                <p className='lead'> Il 70% del materiale utilizzato per realizzare maschere deriva da plastica riciclata</p>
                            </Plx>

                        </Col>
                        <Col xs="12" md="6" className='d-flex justify-content-center mb-5'>
                            <img className='rounded img-resizing' src="https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Col className='mb-5'>
                            <img className='img-resizing rounded' src="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </Col>
                        <Col className='mb-5 d-flex align-items-start overflow-hidden'>
                            <Plx
                                parallaxData={[
                                    {
                                        start: 400,
                                        end: 900,
                                        properties: [
                                            {
                                                startValue: 0,
                                                endValue: 1,
                                                property: "opacity"
                                            },
                                            {
                                                startValue: 400,
                                                endValue: 0,
                                                property: "translateY"
                                            }
                                        ]
                                    },
                                ]}>
                                <p className='lead text-center'>La plastica una volta lavorata assume una struttura robusta, ma anche elastica, che ci permette di realizzare prodotti resistenti e durevoli</p>
                            </Plx>

                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <h1 className='display-6 text-center'>Il nostro team lavora costantemente per garantire il massimo della qualità</h1>
                    </Row>
                    <Row>
                        <Plx
                        parallaxData={[
                            {
                                start:1000,
                                end:1500,
                                properties:[
                                    {
                                        startValue:0,
                                        endValue:1,
                                        property:"opacity"
                                    },
                                    {
                                        startValue:200,
                                        endValue:0,
                                        property:"translateY"
                                    }
                                ]
                            }
                        ]}>
                            <img className="img-resizing" src="https://images.unsplash.com/photo-1532498551838-b7a1cfac622e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </Plx>
                    </Row>
                </Container>
                {/* Info sede */}
                <Container>
                    <Row className='mt-5'>
                        <Col className=''>
                            <h1 className='text-center'>Vieni nella nostra sede a provare le nostre maschere!</h1>
                            <div className='d-flex justify-content-center'>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47440.254917304446!2d12.581962666449565!3d41.99993362032668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f7ab2a9d56b83%3A0x9b4d6a45d56e8d91!2s00013%20Tor%20Lupara%20RM!5e0!3m2!1sit!2sit!4v1713824779747!5m2!1sit!2sit"
                                    width="500"
                                    height="350"
                                    style={{ border: "0" }}
                                    allowfullscreen=""
                                    loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>

                        </Col>
                    </Row>
                </Container>
            </Container>

        </Container>

    )
}

export default AboutUs;