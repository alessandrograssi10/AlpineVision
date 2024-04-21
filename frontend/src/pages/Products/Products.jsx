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
          const masks = filteredProducts.filter(product => product.categoria === "maschera");
          const glasses = filteredProducts.filter(product => product.categoria === "occhiale");
          setProductsMask(masks);
          setProductsGlass(glasses);
          
          // Crea un array di promesse per ottenere le immagini
          const promises = filteredProducts.map(product => getImageById(product._id));
          
          // Attendere che tutte le promesse si risolvano
          Promise.all(promises)
            .then(imageUrls => {
              // Costruire un oggetto con ID prodotto come chiave e URL immagine come valore
              const urls = {};
              filteredProducts.forEach((product, index) => {
                urls[product._id] = imageUrls[index];
                console.log(imageUrls[index]);
              });
              setImageUrlsp(urls);
            })
            .catch(error => console.error("Errore nel recupero delle immagini", error));
        })
        .catch(error => console.error("Errore nel recupero dei prodotti", error));
    }, []);

    
    const getImageById = async (id) => {
      try {
          const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
          if (!response.ok) {
              throw new Error('Errore durante la richiesta');
          }
          const data = await response.json();
          const colore = data[0]?.colore;
          //const count = data.length;
          const imageUrl = `http://localhost:3000/api/products/photo-variante?idProd=${id}&colore=${colore}`;
          //console.log(count);
          return imageUrl;
      } catch (error) {
          console.error("Errore nel recupero dei prodotti", error);
          return ''; 
      }
  };






    return (
        <Container fluid className="p-0 m-0 ">
          <Row className="m-0 p-0 w-100 h-100 no-space-rowBg">
            <Image src={ImmagineBg} className="p-0 img-fluid-no-space w-100 darkness" />
            <div className="centered-text">Esplora tutti i prodotti</div>
          </Row>
          <Row className="ml-0 mr-0 no-space-row mt-3">
            <h3 className="m-4 mb-1 boldText">Maschere da sci</h3>
            <h5 className="m-4 mt-1 mb-2 notbold">Stile Unico</h5>
          </Row>
          <Row className='mt-4'>
            {productsMask.map((prodotto) => {
              return (
                <Col xs={12} sm={6} md={4} lg={4} key={prodotto._id}>
                  <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod'>
                    {/* Immagine del post */}
                    <Card.Img variant="top" className='card-image-fit' src={imageUrlsp[prodotto._id]} />
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
                <Col sm={6} md={4} lg={3} key={prodotto._id}>
                  <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod' style={{ width: '200px', height: '150px' }}>
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
