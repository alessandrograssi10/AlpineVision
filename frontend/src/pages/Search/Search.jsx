import React, { useState, useEffect } from 'react';
import { Image, Container,Form, Button, InputGroup,Card,Col,Row ,Tab,Tabs} from 'react-bootstrap';
import { Link } from 'react-router-dom';


export const Search = () => {
    const [searchElements, setSearchElements] = useState([]);
    const [searchFilteredElements, setSearchFilteredElements] = useState([]);
    const [key, setKey] = useState('vetrina');

    const [query, setQuery] = useState('');


    useEffect(() => {
      const fetchProducts = () =>
          fetch('http://localhost:3000/api/products')
              .then(response => {
                  if (!response.ok) throw new Error('errore');
                  return response.json();
              });

      const fetchPosts = () =>
          fetch('http://localhost:3000/api/posts/getAllPosts')
              .then(response => {
                  if (!response.ok) throw new Error('errore');
                  return response.json();
              });

      const fetchAccessories = () =>
          fetch('http://localhost:3000/api/accessories')
              .then(response => {
                  if (!response.ok) throw new Error('errore');
                  return response.json();
              });

      Promise.all([fetchProducts(), fetchPosts(), fetchAccessories()])
          .then(([products, posts, accessories]) => {
              setSearchElements([...products, ...posts, ...accessories]);
          })
          .catch(error => {
              console.error('Errore nel recupero dei prodotti', error);
          });
  }, []);

  


      const getProductName = (product) => {
        return product.title || product.name || product.nome || "Unknown";
    };
    const getProductImage = (product) => {
      if (product.title) {
          return `http://localhost:3000/api/posts/photo-copertina?id=${product._id}`;
      } else if (product.name) {
          // Assuming the URL pattern requires a placeholder
          return `http://localhost:3000/api/accessories/${product._id}/image1`;
      } else if (product.nome) {
          // Define the URL pattern for `nome` if applicable
          // Replace `your_path` with the actual endpoint path
          return `http://localhost:3000/api/your_path/${product._id}/image1`;
      }
      return null; // Return null if none of the properties are present
  };

      const handleSearch = (event) => {
        setQuery(event.target.value)
        event.preventDefault();
        console.log(searchElements,"searchElements")
        const filteredElements = searchElements.filter(prodotto => {
            const queryLower = query.toLowerCase();
            const properties = ['title', 'name', 'nome'];
    
            // Check for any matching property
            return properties.some(prop => prodotto[prop] && prodotto[prop].toLowerCase().includes(queryLower));
        });
    
        // Imposta gli elementi filtrati nello stato
        setSearchFilteredElements(filteredElements);
    };

    return (
        <Container fluid className="p-0 m-0 ">
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

                <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod  ' >
                  {/* Immagine del prodotto */}
                  <Card.Img key={prodotto._id} variant="top" className='card-image-fit' src={getProductImage(prodotto)}/>
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