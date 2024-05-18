import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container,Form, InputGroup,Card,Col,Row } from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';
import './Search.css';


export const Search = () => {
    const location = useLocation();
    const queryString = location.search;  // Metodo per prendere le informazione dall' URL
    let navigate = useNavigate(); // Metodo per lo spostamento tra pagine
    const cerca = queryString.substring(1);  // Vengo prese le informazione cerca dall' URL

    const [searchElements, setSearchElements] = useState([]); // Tutti gli elementi del database
    const [searchFilteredElements, setSearchFilteredElements] = useState([]); // Elementi filtrati in base alla ricerca
    const [imageUrls, setImageUrls] = useState({}); // Set per tenere le immagini degli elementi
    const [query, setQuery] = useState(''); // Stringa cerca

    useEffect(() => {

        // Vengono recuperati tutti i prodotti
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

        // Vengono recuperati tutti gli articoli
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

        // Vengono recuperati tutti gli accessori
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

        // Funzione per recuperare le immagini in base al tipo di elemento
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

    // Funzione per recuperare il nome dell' elemento in mase al tipo
    const getProductName = (product) => {
        return product.title || product.name || product.nome || "Unknown";
    };

    // Funzione per recuperare il percorso della pagina a cui porta l'elemento in mase al tipo
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

    // Funzione per recuperare il tipo e mostrarlo a schermo in base all'elemento
    const getElementType= (product) => {
        if (product.title) {
            return `articolo blog`;
        } else if (product.name) {
            return `accessorio`;
        } else if (product.nome) {
            return `prodotto`;
        }
        return null;
    };

    // Funzione cerca
    const handleSearch = (event, all) => {
        
        // Se event è una stringa, prende la stringa.
        // Se event è un evento, prende event.target.value per recuperare la stringa. 

        const Query = typeof event === 'string' ? event : event.target.value;
        setQuery(Query);
    
        // Se la stringa cercata è nulla
        if (!Query || Query.trim() === '') {
            setSearchFilteredElements([]);
            return; 
        }
    
        // Viene portata la stringa di ricerca tutta in minuscolo
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


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (!queryString) return;
            event.preventDefault();
            event.stopPropagation();
            handleSearch(event); // Chiama la funzione per gestire la ricerca
        }
    };

    return (
        <Container fluid className="p-0 m-0">
            <Row className="ml-0 mr-0 no-space-row mt-3 m-5 mb-0 p-3 pb-0">
          <h3 className="m-4 mb-1 boldText">TROVA CIÒ CHE DESIDERI</h3>
        </Row>
        <Row className="m-5   mr-5 no-space-row mt-3  mb-0 ">
        <div >
            <Form onSubmit={handleSearch} action = {`http://localhost:3020/search?` + queryString}>
                <InputGroup >
                    <Form.Control
                        type="text"
                        placeholder="Cerca..."
                        value={query}
                        onChange={handleSearch}
                        onKeyDown={handleKeyPress} 
                    />
                </InputGroup>
            </Form>
        </div>
        </Row>

        <Row className="ml-0 mr-0 p-0 mt-3 m-5 ml-0 mb-1">
  <h6 className="m-4 mb-1 p-0 boldText text-left ms-0">Elementi trovati</h6>
</Row>
       
        <div className="border-bottom"></div>



        <Row className='mt-5 m-5' >
          {searchFilteredElements.length > 0 && searchFilteredElements.map((prodotto) => {
           
            return (
              <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id} >

                <Card as={Link} to={getElementPath(prodotto)} className='m-3 card-text-prod card-prod  card-prod-prod-ca' >
                  {/* Immagine del prodotto */}
                  <Card.Img key={prodotto._id} variant="top" className='card-image-fit card-image-fit-se'        src={imageUrls[prodotto._id]}/>
                  {/* Dettagli del prodotto */}
                  <Card.Body>
                  <Card.Title>{getProductName(prodotto)}</Card.Title>
                    
                  {prodotto.prezzo && (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Card.Text>{prodotto.prezzo} €</Card.Text>
  </div>
)}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Card.Text>{getElementType(prodotto)}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
           {searchFilteredElements.length <= 0 && queryString.trim() !== ''  && (
    <Col xs={12} className="text-center mt-5">
      <h4>Nessun elemento trovato.</h4>
    </Col>
  )}
        </Row>
       
      </Container>
    );
}