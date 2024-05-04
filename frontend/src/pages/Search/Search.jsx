import React, { useState, useEffect } from 'react';
import { Image, Container,Form, Button, InputGroup,Card,Col,Row ,Tab,Tabs} from 'react-bootstrap';
import { Link } from 'react-router-dom';


export const Search = () => {
    const [searchElements, setSearchElements] = useState([]);
    const [searchFilteredElements, setSearchFilteredElements] = useState([]);
    const [key, setKey] = useState('vetrina');

    const [query, setQuery] = useState('');


    useEffect(() => {
        fetch(`http://localhost:3000/api/products`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            const filteredProducts = data.filter(product => product.type === "prodotto");
            setSearchElements([...searchElements, ...data]);
          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));


          /*fetch(`http://localhost:3000/api/posts/getAllPosts`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            setSearchElements([...searchElements, ...data]);
            console.log("art", data);
          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));*/

          
      }, []);




      const handleSearch = (event) => {
        if(!query) return;
        event.preventDefault();
        const filteredElements = searchElements.filter(prodotto => {
            if (prodotto.nome) {
                return prodotto.nome.toLowerCase().includes(query.toLowerCase());
            }
            /*else if(prodotto.title)
            {
                return prodotto.title.toLowerCase().includes(query.toLowerCase());
            }
            return false; // Se prodotto.nome non è definito, non includerlo nei risultati*/
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
                        onChange={e => setQuery(e.target.value)}
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
        <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-0 justify-content-left dark-prod p-0 tab-text-color "
      //justify
    >
      <Tab eventKey="vetrina" title="Prodotti" className='dark p-0 color-black dark-prod'>
      
      
      </Tab>
      <Tab eventKey="caratteristiche" title="Articoli">
      <Row className="m-0 p-0 w-100 h-100 d-flex justify-content-center align-items-center p-5 ">
    </Row>

      </Tab>
     
    </Tabs>



        <Row className='mt-5 m-5' >
          {searchFilteredElements.map((prodotto) => {
           
            return (
              <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id} >

                <Card as={Link} to={`/product/${prodotto._id}`} className='m-3 card-text-prod card-prod  ' >
                  {/* Immagine del prodotto */}
                  <Card.Img key={prodotto._id} variant="top" className='card-image-fit' />
                  {/* Dettagli del prodotto */}
                  <Card.Body>
                    <Card.Title>{prodotto.nome}</Card.Title>
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