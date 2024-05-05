import React, { useState, useEffect } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { Image, Container,Form, Button, InputGroup,Card,Col,Row ,Tab,Tabs} from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';
import './Search.css';


export const Search = () => {
    const location = useLocation();
    const queryString = location.search;  // This includes the '?' character
    let navigate = useNavigate();


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
                try {
                    if (product.nome) {  // Assuming you want to fetch only if 'nome' exists
                        urls[product._id] = await getImageById(product._id);
                    } else if (product.title) {
                        urls[product._id] = `http://localhost:3000/api/posts/photo-copertina?id=${product._id}`;
                    } else if (product.name) {
                        urls[product._id] = `http://localhost:3000/api/accessories/${product._id}/image1`;
                    }
                } catch (error) {
                    console.error("Failed to load image for product ID:", product._id, error);
                }
            }
            setImageUrls(urls);  // Set state only after all promises are resolved
        };

        Promise.all([fetchProducts(), fetchPosts(), fetchAccessories()])
            .then(([products, posts, accessories]) => {
                const allElements = [...products, ...posts, ...accessories];
                setSearchElements(allElements);
                setSearchFilteredElements([]);  // Initially set filtered elements to all
                loadImages(allElements);  // Load images only for products
                if (cerca) {
                    handleSearch(cerca,allElements);
                    setQuery(cerca);
                }
            })
            
            .catch(error => {
                console.error('Errore nel recupero degli elementi', error);
            });

        
    }, [cerca]);

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

    const handleSearch = (event, all) => {
        // Determine the source of the query based on input type
        const Query = typeof event === 'string' ? event : event.target.value;
        setQuery(Query);
    
        // Clear filtered results if the query is empty or only whitespace
        if (!Query || Query.trim() === '') {
            setSearchFilteredElements([]);
            console.log("reset", searchFilteredElements);
            return; // Exit early if there's no query to process
        }
    
        // Prepare to filter elements based on the query
        const queryLower = Query.toLowerCase();
        let filteredElements = [];
    
        if (all) {
            // If 'all' is provided, filter using 'all' array
            filteredElements = all.filter(prodotto => {
                const properties = ['title', 'name', 'nome'];
                return properties.some(prop => prodotto[prop] && prodotto[prop].toLowerCase().includes(queryLower));
            });
        } else {
            // Otherwise, filter the standard 'searchElements'
            filteredElements = searchElements.filter(prodotto => {
                const properties = ['title', 'name', 'nome'];
                return properties.some(prop => prodotto[prop] && prodotto[prop].toLowerCase().includes(queryLower));
            });
            navigate('/search?' + Query);
        }
    
        // Update the state with the filtered results and log the action
        setSearchFilteredElements(filteredElements);
        console.log("search", filteredElements);
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