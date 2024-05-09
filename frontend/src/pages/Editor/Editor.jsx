import React, { useState, useEffect } from 'react';
import { Form,Image, Container, Row, Col, Card, Button,Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GetAllProducts,GetAllAccessory ,saveAll} from '../../assets/Scripts/Editor/GetFromData.js';

export const Editor = () => {
  const ruolo = localStorage.getItem("ruoloUser");

    const [product, setProduct] = useState({
        nome: '',
        prezzo: '',
        descrizione: '',
        colore: '',
        coloreVariante: '',
        quantita: '',
        immaginiCop: [],
        immaginiVar: [],
        motto: ''
    });
    
    const [productsAcessory, setProductsAcessory] = useState([]); // Maschere
    const [productsMask, setProductsMask] = useState([]); // Maschere
    const [productsGlass, setProductsGlass] = useState([]); // Occhili

    const [allElements, setAllElements] = useState([]); // Occhili
    const [allElementsCopy, setAllElementsCopy] = useState([]); // Occhili
    const [elementsVerify, setElementsVerify] = useState(false); // Occhili


    const [colorCount, setColorCount] = useState({}); // set per contare i colori
    const [hoverIndex, setHoverIndex] = useState(null); //elemento selezionato
    const [addProd, setAddProd] = useState(false); //elemento selezionato
    //
    const [addMaskProd, setAddMaskProd] = useState(false);
    const [addGlassProd, setAddGlassProd] = useState(false);
    const [addAccessoryProd, setAddAccessoryProd] = useState(false);

    // Prendo i valori dal localstorage
    let Favorite = JSON.parse(localStorage.getItem("Favorite") || "[]");
    const userId = localStorage.getItem('userId');
    const [expandedProductId, setExpandedProductId] = useState(null);
    const [expandedProductIdVariant, setExpandedProductIdVariant] = useState(false);

    let FirstTime = true;
    const [copiedOnce, setCopiedOnce] = useState(false);
    const [riavvia, setRiavvia] = useState(false);

    useEffect(() => {
        //console.log("allElements updated:", allElements);
        //console.log("allElementsCopy updated:", allElementsCopy);

        if (!copiedOnce) {
            setAllElementsCopy(allElements); // Rimuovi lo spread operator qui
            console.log("allElements updated:", allElements);
            FirstTime = false;
            setCopiedOnce(true);
        }
    }, [allElements]);
    useEffect(() => {
        console.log("Carico dal server");
        setAllElements([]);
        try {
            GetAllProducts().then(info => {
                setProductsMask(info.masks);
                setProductsGlass(info.glasses);
                setAllElements(prevAllElements => {
                    const newElements = [...info.masks, ...info.glasses].filter(element => {
                        setCopiedOnce(false);
                        return !prevAllElements.some(prevElement => prevElement._id === element._id);
                    });
                    setCopiedOnce(false);
                    return [...prevAllElements, ...newElements];
                });
            }).catch(error => {
                console.error("Errore nel recupero completo dei prodotti", error);
            });
        } catch (error) {
            console.error("Errore inatteso", error);
        }
        try {
            GetAllAccessory().then(info => {
                setProductsAcessory(info.accessory);
                setAllElements(prevAllElements => {
                    const newElements = info.accessory.filter(element => {
                        setCopiedOnce(false);
                        return !prevAllElements.some(prevElement => prevElement._id === element._id);
                    });
                    setCopiedOnce(false);
                    return [...prevAllElements, ...newElements];
                });
            }).catch(error => {
                console.error("Errore nel recupero completo dei prodotti", error);
            });
        } catch (error) {
            console.error("Errore inatteso", error);
        }
        console.log("all", allElements)
    },  [riavvia]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleDeleteVariant = (productId, variante) => {
        setElementsVerify(true);
        // Trova l'elemento corrispondente a productId in allElements
        const updatedAllElements = allElements.map(element => {
            if (element._id === productId) {
                // Trova la posizione della variante da eliminare
                const variantIndex = element.variants.findIndex(v => v._id === variante._id);
                // Se la variante è stata trovata, rimuovila
                if (variantIndex !== -1) {
                    // Crea una nuova array di varianti senza la variante da eliminare
                    const updatedVariants = [
                        ...element.variants.slice(0, variantIndex),
                        ...element.variants.slice(variantIndex + 1)
                    ];
                    // Se non ci sono più varianti, rimuovi l'intero prodotto
                    if (updatedVariants.length === 0) {
                        return null; // Rimuovi l'elemento
                    }
                    // Restituisci una copia dell'elemento con la variante aggiornata
                    return {
                        ...element,
                        variants: updatedVariants
                    };
                }
            }
            // Se l'elemento non corrisponde a productId o se la variante non è stata trovata, restituiscilo senza modifiche
            return element;
        });
        // Rimuovi gli elementi null dalla lista
        const filteredElements = updatedAllElements.filter(element => element !== null);
        // Aggiorna lo stato con l'array degli elementi aggiornati
        setAllElements(filteredElements);
    };
    
    const handleDelete = (productId) => {
        setElementsVerify(true);
        // Filtra gli elementi, rimuovendo quello con productId corrispondente
        const updatedAllElements = allElements.filter(element => element._id !== productId);
        // Aggiorna lo stato con l'array degli elementi aggiornati
        setAllElements(updatedAllElements);
    };

    const handleImageChangeCop = (event) => {
        const { files } = event.target;
        setProduct(prevState => ({
            ...prevState,
            immaginiCop: [...prevState.immaginiCop, ...files]
        }));
    };
    const handleImageChangeVar = (event) => {
        const { files } = event.target;
        setProduct(prevState => ({
            ...prevState,
            immaginiVar: [...prevState.immaginiVar, ...files]
        }));
    };

    const handleSubmit = (event, type) => {
        event.preventDefault();
        setElementsVerify(true)
        // Raccogli tutte le caratteristiche necessarie per il nuovo prodotto
        const { nome, prezzo, descrizione, colore, quantita, immaginiCop, immaginiVar, motto } = product;
        // Supponendo che allElements contenga tutte le caratteristiche necessarie per il nuovo prodotto
        const totalElements = allElements;
        
        // Combina tutte le informazioni per creare un nuovo oggetto prodotto
        const newProduct = {
            _id: Math.random().toString(36).substring(2),
            nome,
            prezzo,
            descrizione,
            colore: colore,
            "categoria": type,
            quantita,
            "immagini": immaginiCop,
            motto,
            variants: [],
            totalElements
        };
        const variant = {
            _id: Math.random().toString(36).substring(2),
            productId:newProduct._id,
            colore: colore,
            "immagini": immaginiVar,
        };
        newProduct.variants.push(variant);
        
        console.log(newProduct);
        setAllElements([...allElements, newProduct]);
        setAddMaskProd(false);
        setAddGlassProd(false);
        setAddAccessoryProd(false);

    };
    const toggleExpandProduct = (productId) => {
        if (expandedProductId === productId) {
            setExpandedProductId(null); // Close if already open
            setExpandedProductIdVariant(false);
        } else {
            setExpandedProductId(productId); // Open if closed
            
        }
    };

    const addVariantToProduct = (productId) => {
        setElementsVerify(true)
        if(!expandedProductIdVariant)
            {
                setExpandedProductIdVariant(true);
                return;
            }
            const { coloreVariante,immaginiVar } = product;

            const newVariant = {
                _id: Math.random().toString(36).substring(2),
                productId:productId,
                colore: coloreVariante,
                immaginiVar,
            };
        const updatedAllElements = allElements.map(element => {
            if (element._id === productId) {
                const updatedVariants = [...element.variants, newVariant];
                return {
                    ...element,
                    variants: updatedVariants
                };
            }
            return element;
        });
    
        // Aggiorna lo stato con l'array degli elementi aggiornati
        setAllElements(updatedAllElements);
        setExpandedProductIdVariant(false);
    };

    const handleSave = () => {
        setElementsVerify(false)
        
        saveAll(allElements,allElementsCopy);
        setTimeout(() => {
            setRiavvia(!riavvia);
        }, 500); 
    };
    if(ruolo !== "admin"){ window.location.href = '/home'; }
    else return (
        <Container fluid className="p-0 m-0">
          {/* Alert per avvertire che si è in modalità editing */}
          <Alert variant={'warning'} className='m-3 mt-4'>
            STAI IN MODALITA EDITING
          </Alert>
          {/* Alert per chiedere conferma salvataggio modifiche */}
          {elementsVerify && (
            <Alert variant={'danger'} className='m-3 mt-4 d-flex align-items-center justify-content-between'>
              VUOI SALVARE LE MODIFICHE?
              {/* Pulsanti per eliminare o salvare modifiche */}
              <div className="d-flex">
                <Button variant="outline-danger" className="me-2">
                  ELIMINA
                </Button>
                <Button onClick={() => handleSave()} variant="outline-success">
                  SALVA
                </Button>
              </div>
            </Alert>
          )}
          <Row className="ml-0 mr-0 no-space-row mt-3">
            <h3 className="m-4 mb-1 boldText">Maschere da sci</h3>
          </Row>
          {/* Lista delle maschere */}
          <Row className='mt-4'>
            {allElements.map((prodotto) => {
              if (prodotto.categoria !== 'maschera') return null;
              return (
                <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
                  {expandedProductId !== prodotto._id && (
                    <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                      {/* Immagine della maschera */}
                      <div className="card-image-container">
                        <Card.Img
                          key={`${prodotto._id}-front`}
                          className={`card-image-fit-prod ${hoverIndex === prodotto._id ? '' : 'card-image-visible'}`}
                          src={prodotto.imageUrlFront}
                        />
                        <Card.Img
                          key={`${prodotto._id}-lat`}
                          className={`card-image-fit-prod ${hoverIndex === prodotto._id ? 'card-image-visible' : ''}`}
                          src={prodotto.imageUrlSide}
                        />
                      </div>
                      {/* Dettagli della maschera */}
                      <Card.Body>
                        <Card.Title>{prodotto.nome}</Card.Title>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Card.Text>{prodotto.prezzo} €</Card.Text>
                        </div>
                        <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button onClick={() => handleDelete(prodotto._id)} variant='danger'>ELIMINA</Button> {/* Bottone a sinistra */}
                          <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='success'>Varianti</Button> {/* Bottone a destra */}
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                  {expandedProductId === prodotto._id && (
                    <Row key={prodotto._id}>
                      {/* Render additional cards or content here */}
                      <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                        <Card.Body>
                          <Card.Title>{prodotto?.nome?.toUpperCase()}</Card.Title>
                          {prodotto?.variants?.map((variante) => {
                            return (
                              <Row key={prodotto.nome}>
                                <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Card.Title>{variante?.colore?.toLowerCase()}</Card.Title>
                                  <Button onClick={() => handleDeleteVariant(prodotto._id, variante)} variant='danger'>Elimina</Button> {/* Bottone a sinistra */}
                                </div>
                              </Row>
                            )
                          })}
                          {expandedProductIdVariant && (
                            <Row className="border-top m-2">
                              <Form.Group controlId="productName m-2">
                                <Form.Label>colore variante</Form.Label>
                                <Form.Control type="text" name="coloreVariante" value={product.coloreVariante} onChange={handleChange} />
                                <Form.Group controlId="productImages">
                                  <Form.Label>immagini variante</Form.Label>
                                  <Form.Control type="file" multiple onChange={handleImageChangeVar} />
                                </Form.Group>
                              </Form.Group>
                              <Button className='m-2' onClick={() => setExpandedProductIdVariant(false)} variant='danger'>Elimina</Button> {/* Bottone a sinistra */}
                            </Row>
                          )}
                          <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='danger'>Indietro</Button> {/* Bottone a sinistra */}
                            <Button onClick={() => addVariantToProduct(prodotto._id)} variant='success'>Aggiungi</Button> {/* Bottone a sinistra */}
                          </div>
                        </Card.Body>
                      </Card>
                    </Row>
                  )}
                </Col>
              );
            })}
            {addMaskProd ? (
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card className='m-3 card-text-prod '>
                  <Card.Body>
                    <Form  onSubmit={(event) => handleSubmit(event, "maschera")}>
                      <Row>
                        <Col sm={4}>
                          <Form.Group controlId="productName">
                            <Form.Label>Nome prodotto</Form.Label>
                            <Form.Control type="text" name="nome" value={product.nome} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group controlId="productPrice">
                            <Form.Label>Prezzo</Form.Label>
                            <Form.Control type="number" name="prezzo" value={product.prezzo} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group controlId="productColor">
                            <Form.Label>Colore</Form.Label>
                            <Form.Control type="text" name="colore" value={product.colore} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Form.Group controlId="productDescription">
                          <Form.Label>Descrizione prodotto</Form.Label>
                          <Form.Control as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="productQuantity">
                          <Form.Label>Quantità</Form.Label>
                          <Form.Control type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="productImages">
                          <Form.Label>Immagini copertina</Form.Label>
                          <Form.Control type="file" multiple onChange={handleImageChangeCop} />
                        </Form.Group>
                        <Form.Group controlId="productImages">
                          <Form.Label>Immagini prodotto</Form.Label>
                          <Form.Control type="file" multiple onChange={handleImageChangeVar} />
                        </Form.Group>
                        <Form.Group controlId="productMotto">
                          <Form.Label>Motto</Form.Label>
                          <Form.Control type="text" name="motto" value={product.motto} onChange={handleChange} />
                        </Form.Group>
                        <Button className='m-0 mt-4' variant="primary" type="submit">Invia</Button>
                      </Row>
                    </Form>
                    <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button onClick={() => setAddMaskProd(false)} variant='danger'>ELIMINA</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col xs={12} sm={12} md={12} lg={12} className="d-flex align-items-center justify-content-center m-0 mt-5" style={{ height: '100%' }}>
                <Button variant='primary' className='m-1 mb-5' onClick={() => setAddMaskProd(true)}>ADD</Button>
              </Col>
            )}
          </Row>

          {/* Occhiali */}

          <Row className="ml-0 mr-0 no-space-row mt-3">
            <h3 className="m-4 mb-1 boldText">Occhiali</h3>
          </Row>
          {/* Lista delle maschere */}
          <Row className='mt-4'>
            {allElements.map((prodotto) => {
              if (prodotto.categoria !== 'occhiale') return null;
              return (
                <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
                  {expandedProductId !== prodotto._id && (
                    <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                      {/* Immagine della maschera */}
                      <div className="card-image-container">
                        <Card.Img
                          key={`${prodotto._id}-front`}
                          className={`card-image-fit-prod ${hoverIndex === prodotto._id ? '' : 'card-image-visible'}`}
                          src={prodotto.imageUrlFront}
                        />
                        <Card.Img
                          key={`${prodotto._id}-lat`}
                          className={`card-image-fit-prod ${hoverIndex === prodotto._id ? 'card-image-visible' : ''}`}
                          src={prodotto.imageUrlSide}
                        />
                      </div>
                      {/* Dettagli della maschera */}
                      <Card.Body>
                        <Card.Title>{prodotto.nome}</Card.Title>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Card.Text>{prodotto.prezzo} €</Card.Text>
                        </div>
                        <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button onClick={() => handleDelete(prodotto._id)} variant='danger'>ELIMINA</Button> {/* Bottone a sinistra */}
                          <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='success'>Varianti</Button> {/* Bottone a destra */}
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                  {expandedProductId === prodotto._id && (
                    <Row key={prodotto._id}>
                      {/* Render additional cards or content here */}
                      <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                        <Card.Body>
                          <Card.Title>{prodotto?.nome?.toUpperCase()}</Card.Title>
                          {prodotto?.variants?.map((variante) => {
                            return (
                              <Row key={prodotto.nome}>
                                <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Card.Title>{variante?.colore?.toLowerCase()}</Card.Title>
                                  <Button onClick={() => handleDeleteVariant(prodotto._id, variante)} variant='danger'>Elimina</Button> {/* Bottone a sinistra */}
                                </div>
                              </Row>
                            )
                          })}
                          {expandedProductIdVariant && (
                            <Row className="border-top m-2">
                              <Form.Group controlId="productName m-2">
                                <Form.Label>colore variante</Form.Label>
                                <Form.Control type="text" name="coloreVariante" value={product.coloreVariante} onChange={handleChange} />
                                <Form.Group controlId="productImages">
                                  <Form.Label>immagini variante</Form.Label>
                                  <Form.Control type="file" multiple onChange={handleImageChangeVar} />
                                </Form.Group>
                              </Form.Group>
                              <Button className='m-2' onClick={() => setExpandedProductIdVariant(false)} variant='danger'>Elimina</Button> {/* Bottone a sinistra */}
                            </Row>
                          )}
                          <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='danger'>Indietro</Button> {/* Bottone a sinistra */}
                            <Button onClick={() => addVariantToProduct(prodotto._id)} variant='success'>Aggiungi</Button> {/* Bottone a sinistra */}
                          </div>
                        </Card.Body>
                      </Card>
                    </Row>
                  )}
                </Col>
              );
            })}
            {addGlassProd ? (
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card className='m-3 card-text-prod '>
                  <Card.Body>
                    <Form  onSubmit={(event) => handleSubmit(event, "occhiale")}>
                      <Row>
                        <Col sm={4}>
                          <Form.Group controlId="productName">
                            <Form.Label>Nome prodotto</Form.Label>
                            <Form.Control type="text" name="nome" value={product.nome} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group controlId="productPrice">
                            <Form.Label>Prezzo</Form.Label>
                            <Form.Control type="text" name="prezzo" value={product.prezzo} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col sm={4}>
                          <Form.Group controlId="productColor">
                            <Form.Label>Colore</Form.Label>
                            <Form.Control type="text" name="colore" value={product.colore} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Form.Group controlId="productDescription">
                          <Form.Label>Descrizione prodotto</Form.Label>
                          <Form.Control as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="productQuantity">
                          <Form.Label>Quantità</Form.Label>
                          <Form.Control type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="productImages">
                          <Form.Label>Immagini copertina</Form.Label>
                          <Form.Control type="file" multiple onChange={handleImageChangeCop} />
                        </Form.Group>
                        <Form.Group controlId="productImages">
                          <Form.Label>Immagini prodotto</Form.Label>
                          <Form.Control type="file" multiple onChange={handleImageChangeVar} />
                        </Form.Group>
                        <Form.Group controlId="productMotto">
                          <Form.Label>Motto</Form.Label>
                          <Form.Control type="text" name="motto" value={product.motto} onChange={handleChange} />
                        </Form.Group>
                        <Button className='m-0 mt-4' variant="primary" type="submit">Invia</Button>
                      </Row>
                    </Form>
                    <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button onClick={() => setAddGlassProd(false)} variant='danger'>ELIMINA</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col xs={12} sm={12} md={12} lg={12} className="d-flex align-items-center justify-content-center m-0 mt-5" style={{ height: '100%' }}>
                <Button variant='primary' className='m-1 mb-5' onClick={() => setAddGlassProd(true)}>ADD</Button>
              </Col>
            )}
          </Row>


          {/* Accessori */}

          <Row className="ml-0 mr-0 no-space-row mt-3">
            <h3 className="m-4 mb-1 boldText">Accessori</h3>
          </Row>
          {/* Lista delle maschere */}
          <Row className='mt-4'>
            {allElements.map((prodotto) => {
              if (prodotto.categoria === 'occhiale' || prodotto.categoria === 'maschera') return null;
              return (
                <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
                  {expandedProductId !== prodotto._id && (
                    <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                      {/* Immagine della maschera */}
                      <div className="card-image-container">
                        <Card.Img
                          key={`${prodotto._id}-front`}
                          className={`card-image-fit-prod ${hoverIndex === prodotto._id ? '' : 'card-image-visible'}`}
                          src={prodotto.imageUrlFront}
                        />
                        <Card.Img
                          key={`${prodotto._id}-lat`}
                          className={`card-image-fit-prod ${hoverIndex === prodotto._id ? 'card-image-visible' : ''}`}
                          src={prodotto.imageUrlSide}
                        />
                      </div>
                      {/* Dettagli della maschera */}
                      <Card.Body>
                        <Card.Title>{prodotto.name}</Card.Title>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Card.Text>{prodotto.prezzo} €</Card.Text>
                        </div>
                        <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Button onClick={() => handleDelete(prodotto._id)} variant='danger'>ELIMINA</Button> {/* Bottone a sinistra */}
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              );
            })}
            {addAccessoryProd ? (
              <Col xs={12} sm={12} md={12} lg={12}>
                <Card className='m-3 card-text-prod '>
                  <Card.Body>
                    <Form  onSubmit={(event) => handleSubmit(event, "")}>
                      <Row>
                        <Col sm={6}>
                          <Form.Group controlId="productName">
                            <Form.Label>Nome prodotto</Form.Label>
                            <Form.Control type="text" name="nome" value={product.nome} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group controlId="productPrice">
                            <Form.Label>Prezzo</Form.Label>
                            <Form.Control type="text" name="prezzo" value={product.prezzo} onChange={handleChange} />
                          </Form.Group>
                        </Col>
                        <Form.Group controlId="productDescription">
                          <Form.Label>Descrizione prodotto</Form.Label>
                          <Form.Control as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="productImages">
                          <Form.Label>Immagini copertina</Form.Label>
                          <Form.Control type="file" multiple onChange={handleImageChangeCop} />
                        </Form.Group>
                       
                        <Button className='m-0 mt-4' variant="primary" type="submit">Invia</Button>
                      </Row>
                    </Form>
                    <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button onClick={() => setAddAccessoryProd(false)} variant='danger'>ELIMINA</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <Col xs={12} sm={12} md={12} lg={12} className="d-flex align-items-center justify-content-center m-0 mt-5" style={{ height: '100%' }}>
                <Button variant='primary' className='m-1 mb-5' onClick={() => setAddAccessoryProd(true)}>ADD</Button>
              </Col>
            )}
          </Row>
        </Container>
      );
      
};
