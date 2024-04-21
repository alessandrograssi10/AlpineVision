import React, { useState, useEffect } from 'react';
import { Image,Container, Row, Col,Card } from 'react-bootstrap';
import Immagine from '../../assets/Images/mc.png';
import ImmagineBg from '../../assets/Images/BgProd3.png';
import { Link } from 'react-router-dom';

import './Products.css';

export const Products = () => {

    const [productsMask, setProductsMask] = useState([]);
    const [productsGlass, setProductsGlass] = useState([]);
    const [imageUrlsp, setImageUrlsp] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/products`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            const filteredProducts = data.filter(product => product.type === "prodotto");

            // Divide i prodotti in maschere e occhiali
            const masks = filteredProducts.filter(product => product.categoria === "maschera");
            const glasses = filteredProducts.filter(product => product.categoria === "occhiale");

            setProductsMask(masks);
            setProductsGlass(glasses);
            const urls = {};
                filteredProducts.forEach(product => {
                  getImageById(product._id)
                        .then(url => {
                            urls[product._id] = url;
                            setImageUrlsp(urls);
                        })
                        .catch(error => console.error("Errore nel recupero dell'immagine", error));
                });
          })
          .catch(error => {console.error("Errore nel recupero dei prodotti", error);});
    }, []);

    
    const getImageById = async (id) => {
      try {
          const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
          if (!response.ok) {
              throw new Error('Errore durante la richiesta');
          }
          const data = await response.json();
          const colore = data[0]?.colore;
          const imageUrl = `http://localhost:3000/api/products/photo-variante?idProd=${id}&colore=${colore}`;
          console.log(imageUrl);
          return imageUrl;
      } catch (error) {
          console.error("Errore nel recupero dei prodotti", error);
          return ''; 
      }
  };






    return (
        <Container fluid className="p-0 ml-0 mr-0 no-space-row">
          <Row className="m-0 p-0 w-100 h-100 no-space-rowBg">
            <Image src={ImmagineBg} className="p-0 img-fluid w-100 darkness darkness" />
            <div className="centered-text">Esplora tutti i prodotti</div>
          </Row>
          <Row className="ml-0 mr-0 no-space-row mt-3">
            <h3 className="m-4 mb-1 boldText">Maschere da sci</h3>
            <h5 className="m-4 mt-1 mb-2 notbold">Stile Unico</h5>
          </Row>
          <Row className='mt-4'>
            {productsMask.map((prodotto) => {
              return (
                <Col  sm={12} md={6} lg={4} key={prodotto._id}>
                  <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod'>
                    {/* Immagine del post */}
                    <Card.Img variant="top"  src={imageUrlsp[prodotto._id]} />
                    {/* Dettagli del post */}
                    <Card.Body>
                      <Card.Title>{prodotto.nome}</Card.Title>
                      <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          <Row className="ml-0 mr-0 no-space-row">
            <h3 className="m-4 mb-1 boldText">Occhiali da sci</h3>
            <h5 className="m-4 mt-1 mb-2 notbold">Visione Nitida</h5>
          </Row>
          <Row className='mt-4 mb-5'>
            {productsGlass.map((prodotto) => {
              return (
                <Col sm={12} md={6} lg={4} key={prodotto._id}>
                  <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod' style={{ width: '200px', height: '150px' }}>
                    {/* Immagine del post */}
                    <Card.Img variant="top" src={imageUrlsp[prodotto._id]}  />
                    {/* Dettagli del post */}
                    <Card.Body>
                      <Card.Title>{prodotto.nome}</Card.Title>
                      <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      );
      
};
