import React, { useEffect, useState } from 'react';
import { Container, Row, Form,Modal, Col, Carousel, Button, Tabs, Tab, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { BsCheck } from 'react-icons/bs';  // Ensure you have react-icons installed
import { addToVirtualCart } from '../../assets/Scripts/Virtual_Cart.js';

export const Accessory = () => {
    const { id } = useParams();
    const [key, setKey] = useState('vetrina');
    const [product, setProduct] = useState([]);
    const [productInfo, setProductInfo] = useState([]);
    const [productVariantsCop, setproductVariantsCop] = useState([]);
    const userId = localStorage.getItem("userId");
    const [qnt, setQnt] = useState(1);
    const [smShow, setSmShow] = useState(false);
    const [buttonState, setButtonState] = useState('default');
    const [buttonStateDirect, setButtonStateDirect] = useState('default');

    let navigate = useNavigate();

    const [activeIndex, setActiveIndex] = useState(0); // Indice per il carosello
    const [selectedSetIndex, setSelectedSetIndex] = useState(0); // Indice per selezionare il set di immagini
    const [imageSets, setImageSets] = useState([]);

    const imageUrls = [
        `http://localhost:3000/api/accessories/${id}/image1`,
        `http://localhost:3000/api/accessories/${id}/image2`,
        `http://localhost:3000/api/accessories/${id}/image3`
      ];
      
    useEffect(() => {
        fetch(`http://localhost:3000/api/accessories/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const filteredData = data.filter(item => item._id === id);
                setProduct(filteredData);
            })
            .catch(error => {
                console.error("Errore nel recupero dell prodotto:", error);
            });

        
    }, [id]);

   

 

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
                        type: "accessry",
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
            /*setButtonState('login');
            setTimeout(() => {
                setButtonState('default');
            }, 1000);*/
                addToVirtualCart(product[0],null);
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
    
           
            const productDetails = {
                nome: product[0].name,
                colore: null,
                immagine: imageUrls[0], 
                prezzo: product[0].prezzo.toFixed(2)
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
           
            <Row className="d-flex align-items-center pl-3 pt-3 ml-0 mt-4 equal-height">
            <Col lg={7} className="d-flex  flex-column p-3 pl-0 m-0" >
                    <Carousel activeIndex={activeIndex} onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)} className=' m-0 mt-0 mb-0 mr-0'>
                        {imageUrls.map((imageSrc, idx) => (
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
                    <Row className="d-flex mt-3 ml-4 align-items-center">
            <div className='m-3 mt-1 mb-1'>
            <Link to={`/home`} className='text-navbar-box'>HOME</Link> /<Link to={`/accessories`} className='text-navbar-box'>ACCESSORI</Link> / <Link className='text-navbar-box'>{product[0]?.name?.toUpperCase()}</Link>
    </div></Row>
                    <Row className="justify-content-center m-0 mt-3 ml-0 p-0">
                            <h6 className="text-left text-black mb-2">{productInfo?.categoria?.toUpperCase()}</h6>
                        </Row>
                 
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0">
                            <h1 className="text-left text-black title-text-prod">{product[0]?.name}</h1>
                            
                        </Row>
                        
                       
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0 mb-3">
                            <h3 className="text-left text-black text-bold price-text-prod">{product[0]?.prezzo} €</h3>
                        </Row>
 
                        
                       
                        <div className="border-bottom"></div>

                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0 mb-0">
                            <Col xs={12} className="justify-content-left align-items-center pb-4 m-0 mt-1 ml-0 p-0 " >
                                {/*<Button className='button-black-prod  m-2 mt-5' onClick={() => AddToCart()} variant="outline-dark pl-0 ml-0" size="lg"><h3 className='p-0 m-0'>AGGIUNGI AL CARRELLO</h3 ></Button>*/}
                                <Button className={`button-black-prod m-2 mt-5 ${buttonState}`} onClick={addToCart} variant="outline-dark pl-0 ml-0" size="lg">
                {buttonState === 'loading' && <div className="spinner "></div>}
                {buttonState === 'confirmed' && <BsCheck className='icon-confirmed'/>}
                {buttonState === 'default' && <h3 className='p-0 m-0'>AGGIUNGI AL CARRELLO</h3>}
                {buttonState === 'login' && <div className='p-0 m-0'><h3 className='p-0 m-0'>EFFETTUA PRIMA IL LOGIN</h3></div>}
            </Button>
                                
                                <div style={{ width: '10px' }}></div>
                                <Button className={`button-black-prod-nomon m-2 mt-4 mb-0 ${buttonStateDirect}`} onClick={() => DirectPay()} variant="outline-dark" size="lg">
                                {buttonStateDirect === 'loading' && <div className="spinner "></div>}
                                {buttonStateDirect === 'default' && <div className='p-0 m-0'><h3 className='p-0 m-0'>COMPRA ORA</h3></div>}
                                {buttonStateDirect === 'login' && <div className='p-0 m-0'><h3 className='p-0 m-0'>EFFETTUA PRIMA IL LOGIN</h3></div>}

                                </Button>
                            </Col>
                        </Row>
                    
                        <Row className="justify-content-center m-0 mt-1 ml-0 p-0 mb-3">
                            <h6 className="text-left text-black text-bold">SKU: {product[0]?._id}</h6>
                        </Row>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-center m-0 mt-5 ml-0 p-0 mb-3">
                <h3 className="text-center text-black text-bold">{product[0]?.description}</h3>

            </Row>
        </Container>
    );
};
