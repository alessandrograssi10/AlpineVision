import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Col, Carousel, Modal, Button, Tabs, Tab, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ImmagineBg from '../../assets/Images/BgProd3.png';
import './Product.css';
import { BsCheck } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { addToVirtualCart } from '../../assets/Scripts/Virtual_Cart.js';

export const Product = (addToStorage) => {
    const { id } = useParams();
    const [key, setKey] = useState('vetrina');
    const [product, setProduct] = useState([]);
    const [productInfo, setProductInfo] = useState([]);
    const [productVariantsCop, setproductVariantsCop] = useState([]);
    const userId = localStorage.getItem("userId");
    const [activeIndex, setActiveIndex] = useState(0); // Indice per il carosello
    const [selectedSetIndex, setSelectedSetIndex] = useState(0); // Indice per selezionare il set di immagini
    const [imageSets, setImageSets] = useState([]);
    const ImgSimpatica = `http://localhost:3000/api/products/${id}/simpatica`;
    const ImgInnovativa = `http://localhost:3000/api/products/${id}/innovativa`;
    let navigate = useNavigate();
    const [buttonState, setButtonState] = useState('default');
    const [buttonStateDirect, setButtonStateDirect] = useState('default');
    const [showFixedInfo, setShowFixedInfo] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}/variants`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
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
            })
            .catch(error => {
                console.error("Errore nel recupero dell'articolo:", error);
            });


            const handleScroll = () => {
                const scrollY = window.scrollY;
                const threshold = 800; // Altezza in pixel per mostrare il rettangolo
                //const thresholdMax = 2500; // Altezza in pixel per mostrare il rettangolo

                if (scrollY > threshold ) {
                    setShowFixedInfo(true);
                } else {
                    setShowFixedInfo(false);
                }
            };
    
            window.addEventListener('scroll', handleScroll);
    
            // Pulisci l'event listener
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
    }, [id,selectedSetIndex]);

    const handleRadioChange = (event) => {
        const newSetIndex = Number(event.target.value);
        setSelectedSetIndex(newSetIndex);
        setActiveIndex(0); // Resetta l'indice del carosello
        fetchData(product[newSetIndex]?.colore);
    };

    const fetchData = (colore) => {
        const imageUrlf = `http://localhost:3000/api/products/${id}/${colore}/frontale`;
        const imageUrll = `http://localhost:3000/api/products/${id}/${colore}/sinistra`;
        const imageUrlr = `http://localhost:3000/api/products/${id}/${colore}/destra`;
        const imageUrlb = `http://localhost:3000/api/products/${id}/${colore}/posteriore`;
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

    async function addToCart() {
        const quantity = 1;
        const color = product[selectedSetIndex]?.colore;
        const url = 'http://localhost:3000/api/carts/add';
        const cartItem = id;
        
        if (userId) {
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
                setButtonState('loading');
        setTimeout(() => {
            setButtonState('confirmed');
            setTimeout(() => {
                setButtonState('default');
                localStorage.setItem('Cart_Trig', "Trigger");
            }, 500);  
        }, 500);
                if (!response.ok) {
                    throw new Error('Errore');
                }

            } catch (error) { console.error('Error:', error); }
            
        } else{
            addToVirtualCart(productInfo,product[selectedSetIndex]?.colore);
            setButtonState('loading');
        setTimeout(() => {
            setButtonState('confirmed');
            setTimeout(() => {
                setButtonState('default');
                localStorage.setItem('Cart_Trig', "Trigger");
            }, 500);  
        }, 500);
        }
    }

    

    function DirectPay() {
            const quantity = 1;
            const color = product[selectedSetIndex]?.colore;
    
           
            const productDetails = {
                nome: productInfo.nome,
                colore: color,
                immagine: imageSets[0], 
                prezzo: productInfo.prezzo.toFixed(2),
                type: color ? "product" : 'accessory',
                productId: id,
                quantity: 1

            };
            localStorage.setItem("productDetails", JSON.stringify(productDetails));
            setButtonStateDirect('loading');
            setTimeout(() => {
                setButtonStateDirect('default');
                navigate(`/payments/direct`);
            }, 500);
       
    }
    

    return (
        <Container fluid className="p-0">
            
            <Row className="d-flex align-items-center pl-0 pt-3 m-0 ml-0 mt-2 equal-height">
                <Col lg={7} className="d-flex  flex-column p-3 pl-0 m-0" >
                    <Carousel 
                    activeIndex={activeIndex} 
                    onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)} className=' m-0 mt-0 mb-0 mr-0 '
                    indicators={false}  // Mostra gli indicatori                        

                    >
                        {imageSets.map((imageSrc, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    className="d-block w-100 img-prod align-items-center "
                                    src={imageSrc}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>
                <Col lg={5} className="white-panel  p-0 justify-content-center carosello-prod">
                    
                    <div className="shadow-box mx-0">
                    <Row className="d-flex mt-3 ml-4 align-items-center">
            <div className='m-3 mt-1 mb-1'>
            <Link to={`/home`} className='text-box-prod'>HOME / </Link><Link to={`/products`} className='text-box-prod'>PRODOTTI / </Link><Link className='text-box-prod'>{productInfo?.nome?.toUpperCase()}</Link>
    </div></Row>
                    <Row className="justify-content-center m-0 mt-3 ml-0 p-0">
                            <h6 className="text-left text-black mb-2">{productInfo?.categoria?.toUpperCase()}</h6>
                        </Row>
                 
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0">
                            <h1 className="text-left text-black title-text-prod">{productInfo.nome} / {product[selectedSetIndex]?.colore.toUpperCase() ?? ''}</h1>
                            
                        </Row>
                     
                        
                       
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0 mb-3">
                            <h3 className="text-left text-black text-bold price-text-prod">{productInfo.prezzo} €</h3>
                        </Row>
 
                        <div className="border-bottom"></div>
                        <Row className="justify-content-center m-0 mt-4 mb-2 ml-0 p-0">
                            <h6 className="text-left text-black mb-2">COLORI DISPONIBILI:</h6>
                        </Row>
                        <Row className="justify-content-center m-0 mt-1 mb-3 ml-0 p-0">
                            <div className="d-flex align-items-left m-0 p-0">
                                {product.map((item, index) => (
                                    <Form.Check
                                        key={index}
                                        type="radio"
                                        id={`radio-${index}`}
                                        name="image-radio"
                                        className="image-radio-button m-0 p-0 card-prod-prod-ca"
                                        onChange={handleRadioChange}
                                        checked={selectedSetIndex === index}
                                        value={index}
                                        label={<label htmlFor={`radio-${index}`} className={`image-radio-label ${selectedSetIndex === index ? 'selected' : ''}`} style={{ backgroundImage: `url(${productVariantsCop[index]})` }}></label>}
                                    />
                                ))}
                            </div>
                        </Row>
                        <div className="border-bottom"></div>

                        {product[selectedSetIndex]?.quantita > 0 && (
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0 mb-0">
                            <Col xs={12} className="justify-content-left align-items-center pb-4 m-0 mt-1 ml-0 p-0 " >
                                {/*<Button className='button-black-prod  m-2 mt-5' onClick={() => AddToCart()} variant="outline-dark pl-0 ml-0" size="lg"><h3 className='p-0 m-0'>AGGIUNGI AL CARRELLO</h3 ></Button>*/}
                                <Button className={`button-black-prod m-2 mt-5 ${buttonState}`} onClick={addToCart} variant="outline-dark pl-0 ml-0" size="lg">
                {buttonState === 'loading' && <div className="spinner "></div>}
                {buttonState === 'confirmed' && <BsCheck className='icon-confirmed'/>}
                {buttonState === 'default' && <div className='p-0 m-0'><h4 className='p-0 m-0'>AGGIUNGI AL CARRELLO</h4></div>}
                {buttonState === 'login' && <div className='p-0 m-0'><h4 className='p-0 m-0'>EFFETTUA PRIMA IL LOGIN</h4></div>}
            </Button>
                                
                                <div style={{ width: '10px' }}></div>
                                <Button className={`button-black-prod-nomon m-2 mt-4 mb-0 ${buttonStateDirect}`} onClick={() => DirectPay()} variant="outline-dark" size="lg">
                                {buttonStateDirect === 'loading' && <div className="spinner "></div>}
                                {buttonStateDirect === 'default' && <div className='p-0 m-0'><h4 className='p-0 m-0'>COMPRA ORA</h4></div>}
                                {buttonStateDirect === 'login' && <div className='p-0 m-0'><h4 className='p-0 m-0'>EFFETTUA PRIMA IL LOGIN</h4></div>}

                                </Button>
                            </Col>
                        </Row>
                        )}
                        {product[selectedSetIndex]?.quantita <= 0 && (
                        <Row className="justify-content-center m-3 mt-4 ml-2 p-0 mb-0">
                            <Col xs={12} className="justify-content-left align-items-center pb-4 m-0 mt-1 ml-2 p-0 " >
                            <h4 className='p-0 ml-5 m-0'>PRODOTTO NON DISPONIBILE</h4>
                            </Col>
                        </Row>
                        )}
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0 mb-0">
                            <h6 className="text-left text-black text-bold">SKU: {productInfo._id}</h6>
                        </Row>
                    </div>
                </Col>
            </Row>
            <div style={{ backgroundColor: 'white', height: '50px' }}></div>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                //className="mb-0 mt-5 justify-content-center dark-prod p-0 buttonn "
               // variant='pills'
               className="mb-0 mt-0 justify-content-center dark-prod p-0 buttonn tabs-black" // Assicurati che tabs-black sia applicato

            >
                <Tab eventKey="vetrina" title="VETRINA" className='fade dark p-0 color-black mt-0 dark-prod '>

                    <Row className=" m-0 p-0 w-100 h-100 no-space-rowBg-prod ">
                        <Image src={ImgSimpatica} className="p-0 img-fluid-no-space w-100 darkness align-items-center" />
                        <div className="centered-text-p">{productInfo.nome}</div>
                    </Row>
                    <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 mt-2">
                        <h2 className="text-center text-bold">{productInfo.motto}</h2>
                    </Row>
                    <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 pt-2 ">
                        <h5 className="text-center text-bold">{productInfo.descrizione}</h5>

                    </Row>
                    <Row className="m-0 p-0 w-100 h-100 no-space-rowBg-prod">
                        <Image src={ImgInnovativa} className="p-0 m-0 img-fluid-no-space w-100" />
                    </Row>
                </Tab>
                <Tab eventKey="caratteristiche" title="CARATTERISTICHE" className='fade  m-3'>
                    <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 ">
                        <h4 className="text-left text-bold">{formatDescription(productInfo.caratteristiche)}</h4>
                    </Row>
                </Tab>
            </Tabs>
            <div className={` fixed-bottom-info ${(showFixedInfo && product[selectedSetIndex]?.quantita > 0) ? 'show' : ''}`}>
                <div className="info-text p-0">
                    <h4>{productInfo.nome}</h4>
                    <p className='m-0 '>{productInfo.prezzo} €</p>
                </div>
                <Button className={`button-black-prod m-1 mt-2 ${buttonState}`} onClick={addToCart} variant="outline-dark pl-0 ml-0" size="lg">
                {buttonState === 'loading' && <div className="spinner "></div>}
                {buttonState === 'confirmed' && <BsCheck className='icon-confirmed'/>}
                {buttonState === 'default' && <div className='p-0 m-0'><h4 className='p-0 m-0'>AGGIUNGI AL CARRELLO</h4></div>}
                {buttonState === 'login' && <div className='p-0 m-0'><h4 className='p-0 m-0'>EFFETTUA PRIMA IL LOGIN</h4></div>}
            </Button>
                
            </div>
            
        </Container>
    );
};
