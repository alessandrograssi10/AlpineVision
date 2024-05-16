import React, { useState, useEffect } from 'react';
import { Image, Container, Row, Col, Card } from 'react-bootstrap';
import ImmagineBg from '../../assets/Images/BgProd3.png';
import heart from '../../assets/Images/heart-3.png';
import filledHeart from '../../assets/Images/heart-full.png';
import { Link ,useNavigate} from 'react-router-dom';
import './Products.css';

export const Products = () => {
    let navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [productsMask, setProductsMask] = useState([]); // Maschere
    const [productsGlass, setProductsGlass] = useState([]); // Occhili
    const [imageUrlsp, setImageUrlsp] = useState({}); // immagini frontali
    const [imageUrlspLat, setImageUrlspLat] = useState({}); // immagini laterali
    const [colorCount, setColorCount] = useState({}); // set per contare i colori
    const [hoverIndex, setHoverIndex] = useState(null); //elemento selezionato
    const [Favorite, setFavorite] = useState([]); // stato per i preferiti
    const [animateFav, setAnimateFav] = useState({});

    // Prendo i valori dal localstorage
    //let Favorite = JSON.parse(localStorage.getItem("Favorite") || "[]");
    //let Favorite; // Dichiaro Favorite fuori dai blocchi condizionali per renderlo visibile in tutto lo scope
    useEffect(() => {
        const timers = Object.keys(animateFav).map(id => {
            if (animateFav[id]) {
                return setTimeout(() => {
                    setAnimateFav(prev => ({ ...prev, [id]: false }));
                }, 200); // duration should match the CSS transition duration
            }
            return null;
        });
        return () => timers.forEach(timer => clearTimeout(timer));
    }, [animateFav]);

    


    useEffect(() => {
        if (userId) {
            // Effettua la richiesta fetch
            fetch(`http://localhost:3000/api/favourites/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nella richiesta fetch');
                    }
                    return response.json();
                })
                .then(data => {
                    // Aggiorna lo stato dei preferiti
                    const favoriteIds = data.favourites.map(item => item.productId);
                    setFavorite(favoriteIds);
                })
                .catch(error => {
                    console.error('Si è verificato un errore:', error);
                });
        } /*else {
            // Prendi i valori dal localStorage
            const localFavorite = JSON.parse(localStorage.getItem("Favorite") || "[]");
            setFavorite(localFavorite);
        }*/
    }, [userId]);


    useEffect(() => {
        fetch(`http://localhost:3000/api/products`)
            .then(response => { if (!response.ok) { throw new Error('Errore'); } return response.json(); })
            .then(data => {
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
            const imageUrl = `http://localhost:3000/api/products/${id}/${colore}/sinistra`;
            return imageUrl;
        } catch (error) {
            console.error("Errore nel recupero dei prodotti", error);
            return '';
        }
    };


    

    async function handleClickFavorite (prodotto, evento)  {
        evento.preventDefault(); // Evita il comportamento predefinito dell'evento
        evento.stopPropagation(); // Evita la propagazione dell'evento ai genitori
        setAnimateFav(prev => ({ ...prev, [prodotto._id]: true }));
        if(!userId)
        {
            navigate(`/login`);
            return;
        }
        if(Favorite.includes(prodotto._id)) {
               
            if(userId)
                {
                    try {
                        const response = await fetch("http://localhost:3000/api/favourites/remove", {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: userId,
                                productId: prodotto._id,
                                type: "product",
                            })
        
                        });
                    }
                    catch (error) { console.error('Errore:', error); }
                }
                setFavorite(prevFavorites => prevFavorites.filter(id => id !== prodotto._id));

               /* let index = Favorite.indexOf(prodotto._id);
                if (index > -1) {
                    Favorite.splice(index, 1);
                }*/
                if(!userId)localStorage.setItem("Favorite",JSON.stringify(Favorite));

            }
            else{
                if(userId)
                    {
                        try {
                            const response = await fetch("http://localhost:3000/api/favourites/add", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    productId: prodotto._id,
                                    type: "product",
                                })
            
                            });
                        }
                        catch (error) { console.error('Errore:', error); }
                    }
                
                //Favorite.push(prodotto._id);
                setFavorite(prevFavorites => [...prevFavorites, prodotto._id]);

                if(!userId) localStorage.setItem("Favorite",JSON.stringify(Favorite));
            }
    }

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
                            <Card key= {prodotto._id } as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod card-prod-prod-ca' onMouseEnter={() => setHoverIndex(prodotto._id)} onMouseLeave={() => setHoverIndex(null)}>
                                {/* Immagine della maschera */}
                                {/*<Card.Img key={prodotto._id} variant="top" className='card-image-fit' onMouseEnter={() => setHoverIndex(prodotto._id)} onMouseLeave={() => setHoverIndex(null)} src={hoverIndex === prodotto._id ? imageUrlspLat[prodotto._id] : imageUrlsp[prodotto._id]} />*/}
                                <div className="card-image-container">
                                    <Card.Img
                                        key={`${prodotto._id}-front`}
                                        className={`card-image-fit-prod ${hoverIndex === prodotto._id ? '' : 'card-image-visible'}`}
                                        src={imageUrlsp[prodotto._id]}
                                    />
                                    <Card.Img
                                        key={`${prodotto._id}-lat`}
                                        className={`card-image-fit-prod ${hoverIndex === prodotto._id ? 'card-image-visible' : ''}`}
                                        src={imageUrlspLat[prodotto._id]}
                                    />
                                </div>
                                {/* Dettagli della maschera */}
                                <Card.Body>
                                    <Card.Title>{prodotto.nome}</Card.Title>
                                    <Card.Title>{colorCount[prodotto._id]} {colorCount[prodotto._id] > 1 ? 'colori' : 'colore'}</Card.Title>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Card.Text>{prodotto.prezzo} €</Card.Text>
                                        <Image className={`heart ${animateFav[prodotto._id] ? 'animate' : ''}`}  key={`${prodotto._id}-${Favorite.includes(prodotto._id) ? 'filledHeart' : 'heart'}`}   onClick={(e) => {handleClickFavorite(prodotto,e)}} src={Favorite.includes(prodotto._id) ? filledHeart : heart} style={{ width: '25px', height: '25px' }} alt="Descrizione Immagine" />
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
                            <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod card-prod-prod-ca' onMouseEnter={() => setHoverIndex(prodotto._id)}onMouseLeave={() => setHoverIndex(null)}>
                                {/* Immagine della maschera */}
                                {/* <Card.Img key={prodotto._id} variant="top" className='card-image-fit' onMouseEnter={() => setHoverIndex(prodotto._id)} onMouseLeave={() => setHoverIndex(null)} src={hoverIndex === prodotto._id ? imageUrlspLat[prodotto._id] : imageUrlsp[prodotto._id]} />*/}
                                <div
                                    className="card-image-container"

                                >
                                    <Card.Img
                                        key={`${prodotto._id}-front`}
                                        className={`card-image-fit-prod ${hoverIndex === prodotto._id ? '' : 'card-image-visible'}`}
                                        src={imageUrlsp[prodotto._id]}
                                    />
                                    <Card.Img
                                        key={`${prodotto._id}-lat`}
                                        className={`card-image-fit-prod ${hoverIndex === prodotto._id ? 'card-image-visible' : ''}`}
                                        src={imageUrlspLat[prodotto._id]}
                                    />
                                </div>
                                {/* Dettagli della maschera */}
                                <Card.Body>
                                    <Card.Title>{prodotto.nome}</Card.Title>
                                    <Card.Title>{colorCount[prodotto._id]} {colorCount[prodotto._id] > 1 ? 'colori' : 'colore'}</Card.Title>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Card.Text>{prodotto.prezzo} €</Card.Text>
                                        <Image className={`heart ${animateFav[prodotto._id] ? 'animate' : ''}`}  key={`${prodotto._id}-${Favorite.includes(prodotto._id) ? 'filledHeart' : 'heart'}`}   onClick={(e) => {handleClickFavorite(prodotto,e)}} src={Favorite.includes(prodotto._id) ? filledHeart : heart} style={{ width: '25px', height: '25px' }} alt="Descrizione Immagine" />
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
