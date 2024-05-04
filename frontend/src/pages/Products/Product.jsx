import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Col, Carousel, Modal,Button, Tabs, Tab, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './Product.css';
import { Link, useNavigate } from 'react-router-dom';
import Plx from 'react-plx';
import HeaderCart from '../../components/Header/Boxes/header_cart';

export const Product = () => {
    const { id } = useParams();
    const [key, setKey] = useState('vetrina');
    const [product, setProduct] = useState([]);
    const [productInfo, setProductInfo] = useState([]);
    const [productVariantsCop, setproductVariantsCop] = useState([]);
    const userId = localStorage.getItem("userId");
    const [qnt, setQnt] = useState(1);
    const [smShow, setSmShow] = useState(false);

    let navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0); // Indice per il carosello
    const [selectedSetIndex, setSelectedSetIndex] = useState(0); // Indice per selezionare il set di immagini
    const [imageSets, setImageSets] = useState([]);

    const ImgSimpatica = `http://localhost:3000/api/products/${id}/simpatica`;
    const ImgInnovativa = `http://localhost:3000/api/products/${id}/innovativa`;

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}/variants`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('prodotto ricevuto:', data);
                setProduct(data);
                fetchData(data[selectedSetIndex]?.colore);
                data.forEach((item, index) => {
                    productVariantsCop[index] = `http://localhost:3000/api/products/${id}/${item.colore}/frontale`;
                });
            })
            .catch(error => {
                console.error("Errore nel recupero dell prodotto:", error);
            });

        fetch(`http://localhost:3000/api/products/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const datiProd = data.find(item => item._id === id);

                setProductInfo(datiProd);
                console.log('PRODOTTO:', datiProd);
            })
            .catch(error => {
                console.error("Errore nel recupero dell'articolo:", error);
            });
    }, [id]);

    const handleRadioChange = (event) => {
        const newSetIndex = Number(event.target.value);
        console.log("index", event.target.value)
        setSelectedSetIndex(newSetIndex);
        setActiveIndex(0); // Resetta l'indice del carosello
        fetchData(product[newSetIndex]?.colore);
        console.log("index", event.target.value)
    };

    const fetchData = (colore) => {
        const imageUrlf = `http://localhost:3000/api/products/${id}/${colore}/frontale`;
        const imageUrll = `http://localhost:3000/api/products/${id}/${colore}/sinistra`;
        const imageUrlr = `http://localhost:3000/api/products/${id}/${colore}/destra`;
        const imageUrlb = `http://localhost:3000/api/products/${id}/${colore}/posteriore`;
        console.log(imageSets, "url");
        const imageUrls = [imageUrlf, imageUrll, imageUrlr, imageUrlb];
        setImageSets(imageUrls);
    };

    function formatDescription(description) {
        if (description == null) return null;
        return description.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    }

    async function AddToCart() {
        console.log(userId, "UserID");
        if (userId) {
            console.log("carrello");
            const quantity = 1;
            const color = product[selectedSetIndex]?.colore;
            const url = 'http://localhost:3000/api/carts/add';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: id,
                        type: "product",
                        color: color,
                        quantity: quantity
                    })
                    
                });
                setSmShow(true);
                const timer = setTimeout(() => {
                    setSmShow(false);
                }, 700);
                if (!response.ok) {
                    throw new Error('Errore');
                }
                localStorage.setItem('Cart_Trig',"Trigger");

            } catch (error) { console.error('Error:', error); }
        } else {
            navigate(`/login`);
            console.log("login");
        }
    }

    return (
        <Container fluid className="p-0">
            <Row className="d-flex mt-3 ml-4 align-items-center">
            <div className='m-3 mt-1 mb-1'>
      <Link to={`/products`} className='text-navbar-box'>products</Link> / <Link className='text-navbar-box'>{productInfo?.nome?.toLowerCase()}</Link>
    </div></Row>
            <Row className="d-flex align-items-center pl-3 pt-3 equal-height">
                <Col lg={7} className="d-flex  flex-column p-3">
                    <Carousel activeIndex={activeIndex} onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)}>
                        {imageSets.map((imageSrc, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    className="d-block w-100 img-prod align-items-center"
                                    src={imageSrc}

                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
                <Col lg={5} className="white-panel  p-0 justify-content-center carosello-prod">
                    <div className="shadow-box mx-0">
                        <Row>
                            <h1 className="text-left text-black">{productInfo.nome}</h1>
                        </Row>
                        <Row>
                            <h5 key={product} className="text-left text-black">{product[selectedSetIndex]?.colore ?? ''}</h5>
                        </Row>
                       
                        
                        <Row>
                            <div className="d-flex align-items-left m-0 p-0">
                                {product.map((item, index) => (
                                    <Form.Check
                                        key={index}
                                        type="radio"
                                        id={`radio-${index}`}
                                        name="image-radio"
                                        className="image-radio-button m-0 p-0"
                                        onChange={handleRadioChange}
                                        checked={selectedSetIndex === index}
                                        value={index}
                                        label={<label htmlFor={`radio-${index}`} className={`image-radio-label ${selectedSetIndex === index ? 'selected' : ''}`} style={{ backgroundImage: `url(${productVariantsCop[index]})` }}></label>}
                                    />
                                ))}
                            </div>
                        </Row>
                        <Row className="justify-content-center m-0 mt-3">
                            <h3 className="text-left text-black">{productInfo.prezzo}$</h3>
                        </Row>
                        <Row className="justify-content-center m-0 mt-3">
                            <Col xs={12} className="d-flex justify-content-left align-items-center pb-5 p-0 " >
                                <Button className='button-black-prod  m-0 mt-3' onClick={() => AddToCart()} variant="outline-dark pl-0 ml-0" size="md">AGGIUNGI AL CARRELLO</Button>
                                <Modal 
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-vcenter "
        className='modal-open custom-modal'
        backdrop={true}
      >
        
        <Modal.Body className='custom-modal-body'>prodotto aggiunto</Modal.Body>
      </Modal>
                                <div style={{ width: '10px' }}></div>
                                <Button className='button-black-prod m-0 mt-3' href="/EternalAura" variant="outline-dark" size="md">COMPRA ORA</Button>
                            </Col>
                        </Row>
                    

                    </div>
                </Col>
            </Row>
            <div style={{ backgroundColor: 'white', height: '50px' }}></div>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-5 mt-5 justify-content-center dark-prod p-0 buttonn   tab-text-color tabs-black"
                variant='pills'
                //transition="fade" 
            >
                <Tab eventKey="vetrina" title="Vetrina" className='fade dark p-0 color-black mt-5 dark-prod '>

                    <Row className=" m-0 p-0 w-100 h-100 no-space-rowBg-prod ">
                        <Image src={ImgSimpatica} className="p-0 img-fluid-no-space w-100 darkness align-items-center" />
                        <Plx className=' centered-text '
                            parallaxData={[
                                {
                                    start: 100,
                                    end: 500,
                                    properties: [
                                        {
                                            startValue: 0,
                                            endValue: 1,
                                            property: "opacity"
                                        },
                                        {
                                            startValue: 0,
                                            endValue: 0,
                                            property: "translateY"
                                        },

                                    ]
                                },
                                {
                                    start: 500, // Inizia dopo il completamento dell'effetto precedente
                                    end: 800,   // Termine dell'effetto di ingrandimento
                                    properties: [
                                        {
                                            startValue: 1, // Ingrandimento iniziale della scritta
                                            endValue: 1.3, // Effetto di ingrandimento
                                            property: "scale"
                                        },
                                        {
                                            startValue: 0,
                                            endValue: 0,
                                            property: "translateY"
                                        },
                                    ]
                                }

                            ]}>
                            <div className="centered-text d-flex">{productInfo.nome}</div>

                        </Plx>
                        {/*<div className="centered-text">{productInfo.nome}</div>*/}
                    </Row>
                    <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 ">
                        <h3 className="text-center text-bold">{productInfo.motto}</h3>
                    </Row>
                    <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 ">
                        <Plx
                            parallaxData={[
                                {
                                    start: 500,
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
                                        },

                                    ]
                                },

                            ]}>
                            <h4 className="text-center text-bold">{productInfo.descrizione}</h4>

                        </Plx>
                    </Row>
                    <Row className="m-0 p-0 w-100 h-100 no-space-rowBg-prod">
                        <Image src={ImgInnovativa} className="p-0 m-0 img-fluid-no-space w-100" />
                    </Row>
                </Tab>
                <Tab eventKey="caratteristiche" title="Caratteristiche" className='fade  m-3'>
                    <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 ">
                        <h3 className="text-left text-bold">{formatDescription(productInfo.caratteristiche)}</h3>
                    </Row>

                </Tab>

            </Tabs>
        </Container>
    );
};
