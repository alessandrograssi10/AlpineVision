import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutUs.css';
import Plx from 'react-plx';
import skiGoggles from '../../assets/AboutUsPhoto/skiGoggles.jpg';
import leaf from '../../assets/AboutUsPhoto/leaf2.jpg';

function AboutUs() {



    return (
        <>
            <div id="mainContainer" fluid className='mb-5 w-100'>
                {/* Immagine */}
                <div id="hdDIV" className=''>
                    <div>
                        <h1 id="knowUsH1">INIZIA A CONOSCERCI!</h1>
                    </div>
                    <div>
                        <img id="mountainPH" src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        <Container id="hdH1Container" className="text-center">
                            <Plx
                                parallaxData={[
                                    {
                                        start: 0,
                                        end: 210,
                                        easing: "linear",
                                        properties: [
                                            {
                                                startValue: 0,
                                                endValue: 1,
                                                property: "opacity"
                                            },
                                            {
                                                startValue: 40,
                                                endValue: 0,
                                                property: "translateY"
                                            }

                                        ]
                                    }
                                ]}>
                                {/* Problema */}
                                <Container className="">
                                    <h1 id="infoProblemH1" className='display-4'> Sapevi che la neve può riflettere fino all'80% della luce solare?</h1>
                                </Container>

                            </Plx>

                        </Container>
                    </div>
                </div>


                <div className='bg-black'>
                    <Row className='d-flex align-items-center'>
                        {/* Descrizione */}
                        <Col xs="12" md="6" className="text-end d-flex align-items-center bg-black">
                            <Plx
                                parallaxData={[
                                    {
                                        start: 0,
                                        end: 500,
                                        easing: "linear",
                                        properties: [
                                            {
                                                startValue: -740,
                                                endValue: 0,
                                                property: "translateX"
                                            }
                                        ]
                                    }
                                ]}>

                                <div id="skiGogglesPlus" className='pe-2 overflow-hidden'>
                                    <h1 className='text-light display-6'>Alpine Vision realizza maschere da sci ed altri accessori che proteggono i tuoi occhi dai raggi solari </h1>
                                </div>

                            </Plx>

                        </Col>
                        {/* Soluzione */}
                        <Col xs="12" md="6" className="d-flex justify-content-center">
                            <img id="skiGogglesImg" className='img-resizing' fluid src={skiGoggles} alt="" />
                        </Col>
                    </Row>
                </div>

                {/* Perchè scegliere Alpine Vision */}
                <div className='bg-light'>
                    <Row id="greenBg" className='pt-5'>
                        <Col xs="12" md="6" className='d-flex justify-content-center'>
                            <img id="pollutionImg" className='img-resizing' src={leaf} alt="" />
                        </Col>
                        <Col xs="12" md="6" className='text-center p-3 overflow-hidden'>
                            <h1 className='mb-5'>Alpine Vision rispetta
                                <Plx
                                    parallaxData={[
                                        {
                                            start: 750,
                                            end: 950,
                                            easing: "linear",
                                            properties: [
                                                {
                                                    startValue: 1,
                                                    endValue: 1.5,
                                                    property: "scale"
                                                },
                                                {
                                                    startValue: 0,
                                                    endValue: 20,
                                                    property: "translateY"
                                                },
                                                {
                                                    startValue: '#000',
                                                    endValue: '#368156',
                                                    property: "color"
                                                }

                                            ]
                                        }
                                    ]}>
                                    <h1>l'ambiente!</h1>
                                </Plx>

                            </h1>
                            <p className='lead'> Il 75% del materiale utilizzato per realizzare maschere deriva da plastica riciclata</p>
                        </Col>
                    </Row>

                    <Row className='ps-4 bg-black pt-4 pb-4 mb-5 d-flex align-items-center '>
                        <Col >
                            <img className='img-resizing rounded' src="https://images.unsplash.com/photo-1491895200222-0fc4a4c35e18?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </Col>
                        <Col className='d-flex align-items-center overflow-hidden'>
                            <Plx
                                parallaxData={[
                                    {
                                        start: 550,
                                        end: 900,
                                        properties: [
                                            {
                                                startValue: -0.5,
                                                endValue: 1,
                                                property: "opacity"
                                            },
                                            {
                                                startValue: -200,
                                                endValue: 0,
                                                property: "translateY"
                                            }
                                        ]
                                    },
                                ]}>
                                <p className='lead text-center text-light'>Una volta lavorata, la plastica, assume una struttura robusta, ma anche elastica, che ci permette di realizzare prodotti resistenti e durevoli</p>
                            </Plx>

                        </Col>
                    </Row>

                    <Row id="mateImg" className=''>
                        <h1 className='display-5 text-center'>Il nostro team lavora costantemente per garantire il massimo della qualità</h1>
                    </Row>
                    <Row>
                        <Plx
                            parallaxData={[
                                {
                                    start: 1780,
                                    end: 2000,
                                    easing: "linear",
                                    properties: [
                                        {
                                            startValue: 1,
                                            endValue: 1.2,
                                            property: "scale"
                                        }
                                    ]
                                },
                            
                            ]}>
                            <img className="img-resizing" src="https://images.unsplash.com/photo-1532498551838-b7a1cfac622e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </Plx>
                    </Row>
                </div>
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
            </div>

        </>


    )
}

export default AboutUs;