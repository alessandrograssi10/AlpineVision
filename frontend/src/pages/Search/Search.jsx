import React, { useState, useEffect } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { Image, Container,Form, Button, InputGroup,Card,Col,Row ,Tab,Tabs} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Search.css';


export const Search = () => {
    const location = useLocation();
    const queryString = location.search;  // This includes the '?' character

    // Remove the '?' to get everything after it
    const cerca = queryString.substring(1);

    const [searchElements, setSearchElements] = useState([]);
    const [searchFilteredElements, setSearchFilteredElements] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [key, setKey] = useState('vetrina');
    const [query, setQuery] = useState('');

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                if (!response.ok) throw new Error('Errore durante il recupero dei prodotti');
                const products = await response.json();
                return products;
            } catch (error) {
                console.error("Errore nel recupero dei prodotti", error);
                return [];
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/posts/getAllPosts');
                if (!response.ok) throw new Error('Errore durante il recupero dei post');
                return await response.json();
            } catch (error) {
                console.error("Errore nel recupero dei post", error);
                return [];
            }
        };

        const fetchAccessories = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/accessories');
                if (!response.ok) throw new Error('Errore durante il recupero degli accessori');
                return await response.json();
            } catch (error) {
                console.error("Errore nel recupero degli accessori", error);
                return [];
            }
        };

        const loadImages = async (products) => {
            const urls = {};
            for (const product of products) {
                if (product.nome) {
                    const url = await getImageById(product._id);
                    urls[product._id] = url;
                }
                else if (product.title) {
                    urls[product._id] =  `http://localhost:3000/api/posts/photo-copertina?id=${product._id}`;
                } else if (product.name) {
                    urls[product._id] =  `http://localhost:3000/api/accessories/${product._id}/image1`;
                }
            }
            setImageUrls(urls);
        };

        Promise.all([fetchProducts(), fetchPosts(), fetchAccessories()])
            .then(([products, posts, accessories]) => {
                const allElements = [...products, ...posts, ...accessories];
                setSearchElements(allElements);
                setSearchFilteredElements([]);  // Initially set filtered elements to all
                loadImages(allElements);  // Load images only for products
                if(cerca) handleSearch(cerca);

            })
            .catch(error => {
                console.error('Errore nel recupero degli elementi', error);
            });

        
    }, []);

    const getProductName = (product) => {
        return product.title || product.name || product.nome || "Unknown";
    };

    const getElementPath= (product) => {
        if (product.title) {
            return `/blogarticle/${product._id}`;
        } else if (product.name) {
            return `/accessory/${product._id}`;
        } else if (product.nome) {
            return `/product/${product._id}`;
        }
        return null;
    };

    const handleSearch = (event) => {
        const Query = typeof event === 'string' ? event : event.target.value;
        setQuery(Query);
        if(!Query)setSearchFilteredElements([]);
        if (Query.trim() === '') {
            setSearchFilteredElements([]);
        }

        if(Query)
        {
        const queryLower = Query.toLowerCase();

        const filteredElements = searchElements.filter(prodotto => {
            const properties = ['title', 'name', 'nome'];
            return properties.some(prop => prodotto[prop] && prodotto[prop].toLowerCase().includes(queryLower));
        });
        setSearchFilteredElements(filteredElements);
        console.log("cerco");
    }
    };
    const getImageById = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
            if (!response.ok) throw new Error('Errore durante la richiesta');
            const data = await response.json();
            const colore = data[0]?.colore;
            return `http://localhost:3000/api/products/${id}/${colore}/frontale`;
        } catch (error) {
            console.error("Errore nel recupero dei prodotti", error);
            return null;
        }
    };

    return (
        <Container fluid className="p-0 m-0 ">
            <Row className="ml-0 mr-0 no-space-row mt-3 m-5 mb-1">
          <h3 className="m-4 mb-1 boldText">CERCA</h3>
        </Row>
        <div className="container mt-5">
            <Form onSubmit={handleSearch}>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Cerca..."
                        value={query}
                        onChange={handleSearch}
                        
                    />
                    <Button variant="primary" type="submit">
                        Cerca
                    </Button>
                </InputGroup>
            </Form>
        </div>
        <Row className="ml-0 mr-0 no-space-row mt-3 m-5 mb-1">
          <h3 className="m-4 mb-1 boldText">Elementi trovati</h3>
        </Row>
       



        <Row className='mt-5 m-5' >
          {searchFilteredElements.map((prodotto) => {
           
            return (
              <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id} >

                <Card as={Link} to={getElementPath(prodotto)} className='m-3 card-text-prod card-prod  ' >
                  {/* Immagine del prodotto */}
                  <Card.Img key={prodotto._id} variant="top" className='card-image-fit card-image-fit-se'        src={imageUrls[prodotto._id]}/>
                  {/* Dettagli del prodotto */}
                  <Card.Body>
                  <Card.Title>{getProductName(prodotto)}</Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
       
      </Container>
    );
}