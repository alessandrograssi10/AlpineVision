import React, { useState, useEffect } from 'react';
import { Image,Container, Row, Form, Col, Carousel, Button } from 'react-bootstrap';
import Immagine from '../../assets/Images/mc.png';
import './Products.css';
import axios from 'axios';

export const Products = () => {

    const [products, setProducts] = useState([]);

    // Effettua una chiamata al backend quando il componente viene montato
    useEffect(() => {
        axios.get('http://localhost:3020/products')
            .then(response => {
                // Aggiorna lo stato con i dati ricevuti
                setProducts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the names:", error);
            });
    }, []); // L'array vuoto come secondo argomento assicura che l'effetto venga eseguito solo una volta

    return (
        <Container fluid className="p-0">
            <Row className="ml-0 mr-0 no-space-row">
        <div style={{ backgroundColor: 'white', height: '50px' }}></div>

        <Col style={{ position: "absolute" }}className="text-center m-0 bg-white text-black p-3">
            <h3 className='motto2'>Prodotti</h3>
          </Col>
        <Image src={Immagine} className="img-fluid-no-space m-0 p-0" />

        </Row>
        </Container>
    );
};
