import React, { useEffect, useState } from 'react';
import { Container, Row, Form,Modal, Col, Carousel, Button, Tabs, Tab, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import Plx from 'react-plx';

export const Accessory = () => {
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

                console.log('prodotto ricevuto:', filteredData);
                console.log("Prodffff",filteredData)
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
                        type: "accessory",
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
            <Row className="d-flex align-items-center pl-3 pt-3 equal-height">
                <Col lg={7} className="d-flex  flex-column p-3">
                    <Carousel activeIndex={activeIndex} onSelect={(selectedIndex, e) => setActiveIndex(selectedIndex)}>
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
                        <Row>
                            <h1 className="text-left text-black">{product[0]?.name}</h1>
                        </Row>
                       
                       
                        
                        
                        <Row className="justify-content-center m-0 mt-3">
                            <h3 className="text-left text-black">{product[0]?.prezzo}$</h3>
                        </Row>
                        <Row className="justify-content-center m-0 mt-3">
                            <Col xs={12} className="d-flex justify-content-left align-items-center pb-5 p-0 ">
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
            
        </Container>
    );
};
