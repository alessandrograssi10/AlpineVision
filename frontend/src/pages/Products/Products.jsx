import React, { useState, useEffect } from 'react';
import { Image, Container, Row, Col, Card } from 'react-bootstrap';
import ImmagineBg from '../../assets/Images/BgProd3.png';
import heart from '../../assets/Images/heart-3.png';
import { Link } from 'react-router-dom';
import './Products.css';

export const Products = () => {
    const [productsMask, setProductsMask] = useState([]); // Maschere
    const [productsGlass, setProductsGlass] = useState([]); // Occhili
    const [imageUrlsp, setImageUrlsp] = useState({}); // immagini frontali
    const [imageUrlspLat, setImageUrlspLat] = useState({}); // immagini laterali
    const [colorCount, setColorCount] = useState({}); // set per contare i colori
    const [hoverIndex, setHoverIndex] = useState(null); //elemento selezionato

    useEffect(() => {
        fetch(`http://localhost:3000/api/products`)
            .then(response => {if (!response.ok) {throw new Error('Errore');}return response.json();})
            .then(data => {
                //Divido i prodotti dagli accessori
                //Divido i prodotti maschera da quelli occhiale
                const masks = data.filter(product => product.categoria === "maschera");
                const glasses = data.filter(product => product.categoria === "occhiale");
                setProductsMask(masks);
                setProductsGlass(glasses);

                // Crea un array di promises per ottenere le immagini tutte insieme
                const promises = data.map(product => getImageById(product._id));
                const promisesLat = data.map(product => getImageByIdlat(product._id));

                // Attendere che tutte le promises vengano completate
                Promise.all(promises)
                    .then(imageUrls => {
                        const urls = {};
                        data.forEach((product, index) => {
                            urls[product._id] = imageUrls[index];
                            console.log(imageUrls[index]);
                        });
                        setImageUrlsp(urls);
                    })
                    .catch(error => console.error("Errore nel recupero delle immagini", error));

                // Ripeto l'operazione di prima per le immagini laterali
                Promise.all(promisesLat)
                    .then(imageUrls => {
                        const urls = {};
                        data.forEach((product, index) => {
                            urls[product._id] = imageUrls[index];
                            console.log(imageUrls[index]);
                        });
                        setImageUrlspLat(urls);
                    })
                    .catch(error => console.error("Errore nel recupero delle immagini", error));
            })
            .catch(error => console.error("Errore nel recupero dei prodotti", error));
    }, []);

    //Funzione per reperire le immagini dal backend (frontale)
    const getImageById = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
            if (!response.ok) {
                throw new Error('Errore durante la richiesta');
            }
            const data = await response.json();
            const colore = data[0]?.colore;
            colorCount[id] = data.length;
            const imageUrl = `http://localhost:3000/api/products/${id}/${colore}/frontale`;
            return imageUrl;
        } catch (error) {
            console.error("Errore nel recupero dei prodotti", error);
        }
    };

    //Funzione per reperire le immagini dal backend (laterale)
    const getImageByIdlat = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
            if (!response.ok) {
                throw new Error('Errore durante la richiesta');
            }
            const data = await response.json();
            const colore = data[0]?.colore;
            //const count = data.length;
            const imageUrl = `http://localhost:3000/api/products/${id}/${colore}/sinistra`;
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
             {/* Lista delle maschere */}
            <Row className='mt-4' >
                {productsMask.map((prodotto) => {
                    return (
                        <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id} >
                            <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod  ' >
                                {/* Immagine della maschera */}
                                <Card.Img key={prodotto._id} variant="top" className='card-image-fit' onMouseEnter={() => setHoverIndex(prodotto._id)} onMouseLeave={() => setHoverIndex(null)} src={hoverIndex === prodotto._id ? imageUrlspLat[prodotto._id] : imageUrlsp[prodotto._id]} />
                                {/* Dettagli della maschera */}
                                <Card.Body>
                                    <Card.Title>{prodotto.nome}</Card.Title>
                                    <Card.Title>{colorCount[prodotto._id]} colori</Card.Title>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Card.Text>{prodotto.prezzo} €</Card.Text>
                                        <img src={heart} style={{ width: '25px', height: '25px' }} alt="Descrizione Immagine" />
                                    </div>
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
            {/* Lista degli occhiali */}
            <Row className='mt-4 mb-5'>
            {productsGlass.map((prodotto) => {
                    return (
                        <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id} >
                            <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod  ' >
                                {/* Immagine della maschera */}
                                <Card.Img key={prodotto._id} variant="top" className='card-image-fit' onMouseEnter={() => setHoverIndex(prodotto._id)} onMouseLeave={() => setHoverIndex(null)} src={hoverIndex === prodotto._id ? imageUrlspLat[prodotto._id] : imageUrlsp[prodotto._id]} />
                                {/* Dettagli della maschera */}
                                <Card.Body>
                                    <Card.Title>{prodotto.nome}</Card.Title>
                                    <Card.Title>{colorCount[prodotto._id]} colori</Card.Title>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Card.Text>{prodotto.prezzo} €</Card.Text>
                                        <img src={heart} style={{ width: '25px', height: '25px' }} alt="Descrizione Immagine" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};
