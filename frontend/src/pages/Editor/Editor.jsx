import React, { useState, useEffect } from 'react';
import { Form, Image, Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { GetAllProducts, GetAllAccessory, saveAll } from '../../assets/Scripts/Editor/GetFromData.js';
import './Editor.css';

export const Editor = () => {
  const ruolo = localStorage.getItem("ruoloUser");

  const [product, setProduct] = useState({
    nome: '',
    prezzo: '',
    descrizione: '',
    colore: '',
    coloreVariante: '',
    quantita: '',
    caratteristiche: '',
    immaginiCop: [],
    immaginiVar: [],
    motto: ''
  });

  const [productsAccessory, setProductsAccessory] = useState([]);
  const [productsMask, setProductsMask] = useState([]);
  const [productsGlass, setProductsGlass] = useState([]);

  const [allElements, setAllElements] = useState([]);
  const [allElementsCopy, setAllElementsCopy] = useState([]);
  const [elementsVerify, setElementsVerify] = useState(false);

  const [colorCount, setColorCount] = useState({});
  const [hoverIndex, setHoverIndex] = useState(null);
  const [addProd, setAddProd] = useState(false);
  const [addMaskProd, setAddMaskProd] = useState(false);
  const [addGlassProd, setAddGlassProd] = useState(false);
  const [addAccessoryProd, setAddAccessoryProd] = useState(false);

  let Favorite = JSON.parse(localStorage.getItem("Favorite") || "[]");
  const userId = localStorage.getItem('userId');
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [expandedProductIdVariant, setExpandedProductIdVariant] = useState(false);

  const [copiedOnce, setCopiedOnce] = useState(false);
  const [riavvia, setRiavvia] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!copiedOnce) {
      setAllElementsCopy(allElements);
      console.log("allElements updated:", allElements);
      setCopiedOnce(true);
    }
  }, [allElements]);

  useEffect(() => {
    console.log("Loading from server");
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
        console.error("Error fetching all products", error);
      });
    } catch (error) {
      console.error("Unexpected error", error);
    }
    try {
      GetAllAccessory().then(info => {
        setProductsAccessory(info.accessory);
        setAllElements(prevAllElements => {
          const newElements = info.accessory.filter(element => {
            setCopiedOnce(false);
            return !prevAllElements.some(prevElement => prevElement._id === element._id);
          });
          setCopiedOnce(false);
          return [...prevAllElements, ...newElements];
        });
      }).catch(error => {
        console.error("Error fetching all accessories", error);
      });
    } catch (error) {
      console.error("Unexpected error", error);
    }
    console.log("all", allElements);
  }, [riavvia]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDeleteVariant = (productId, variante) => {
    setElementsVerify(true);
    const updatedAllElements = allElements.map(element => {
      if (element._id === productId) {
        const variantIndex = element.variants.findIndex(v => v._id === variante._id);
        if (variantIndex !== -1) {
          const updatedVariants = [
            ...element.variants.slice(0, variantIndex),
            ...element.variants.slice(variantIndex + 1)
          ];
          if (updatedVariants.length === 0) {
            return null;
          }
          return {
            ...element,
            variants: updatedVariants
          };
        }
      }
      return element;
    });
    const filteredElements = updatedAllElements.filter(element => element !== null);
    setAllElements(filteredElements);
  };

  const handleDelete = (productId) => {
    setElementsVerify(true);
    const updatedAllElements = allElements.filter(element => element._id !== productId);
    setAllElements(updatedAllElements);
  };

  const handleImageChangeCop = (event) => {
    const { files } = event.target;
    setProduct(prevState => ({
      ...prevState,
      immaginiCop: [...files]
    }));
  };

  const handleImageChangeVar = (event) => {
    const { files } = event.target;
    setProduct(prevState => ({
      ...prevState,
      immaginiVar: [ ...files]
    }));
  };

  const handleSubmit = (event, type) => {
    console.log("Submit Type:", type);
    event.preventDefault();

    if (type === 'maschera' || type === 'occhiale') {
      const validationErrors = validateFormProdAndAcc();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    setElementsVerify(true);

    const { nome, prezzo, descrizione, colore, quantita, immaginiCop, immaginiVar, motto, caratteristiche } = product;
    const totalElements = allElements;

    const newProduct = {
      _id: Math.random().toString(36).substring(2),
      nome,
      prezzo,
      descrizione,
      colore: colore,
      categoria: type,
      quantita,
      immagini: immaginiCop,
      motto,
      caratteristiche,
      variants: [],
      totalElements
    };
    const variant = {
      _id: Math.random().toString(36).substring(2),
      productId: newProduct._id,
      colore: colore,
      immagini: immaginiVar,
    };
    newProduct.variants.push(variant);

    console.log(newProduct);
    setAllElements([...allElements, newProduct]);
    setAddMaskProd(false);
    setAddGlassProd(false);
    setAddAccessoryProd(false);

    setProduct({
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
  };

  const toggleExpandProduct = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
      setExpandedProductIdVariant(false);
    } else {
      setExpandedProductId(productId);
    }
  };

  const addVariantToProduct = (productId) => {
    setElementsVerify(true);
    if (!expandedProductIdVariant) {
      setExpandedProductIdVariant(true);
      return;
    }
    const { coloreVariante, immaginiVar } = product;

    const newVariant = {
      _id: Math.random().toString(36).substring(2),
      productId: productId,
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

    setAllElements(updatedAllElements);
    setExpandedProductIdVariant(false);
  };

  const handleSave = () => {
    setElementsVerify(false);
    saveAll(allElements, allElementsCopy);
    setTimeout(() => {
      setRiavvia(!riavvia);
    }, 500);
  };

  const handleReload = () => {
    setElementsVerify(false);
    setTimeout(() => {
      setRiavvia(!riavvia);
    }, 500);
  };

  const validateFormProdAndAcc = () => {
    const newErrors = {};
    if (!product.nome) newErrors.nome = 'Nome del prodotto è richiesto.';
    if (!product.prezzo || product.prezzo <= 0) newErrors.prezzo = 'Prezzo valido è richiesto.';
    if (!product.colore) newErrors.colore = 'Colore del prodotto è richiesto.';
    if (!product.descrizione) newErrors.descrizione = 'Descrizione del prodotto è richiesta.';
    if (!product.quantita || product.quantita <= 0) newErrors.quantita = 'Quantità valida è richiesta.';
    //Da finire
    if (!product.quantita || product.quantita <= 0) newErrors.quantita = 'Quantità valida è richiesta.';
    if (!product.quantita || product.quantita <= 0) newErrors.quantita = 'Quantità valida è richiesta.';
//
    if (!product.immaginiCop || product.immaginiCop.length !== 2) newErrors.immaginiCop = '2 immagini richieste.';
    if (!product.immaginiVar || product.immaginiVar.length !== 4) newErrors.immaginiVar = '4 immagini richieste.';
    return newErrors;
  };

  if (ruolo !== "admin" && ruolo !== "editor-prodotti") {
    window.location.href = '/home';
    return null;
  } else return (
    <Container fluid className="p-0 m-0">
      <Alert variant={'warning'} className='m-3 mt-4'>
        STAI IN MODALITA EDITING
      </Alert>
      {elementsVerify && (
        <Alert variant={'danger'} className='m-3 mt-4 d-flex align-items-center justify-content-between'>
          VUOI SALVARE LE MODIFICHE?
          <div className="d-flex">
            <Button onClick={() => handleReload()} variant="outline-danger" className="me-2">
              ELIMINA
            </Button>
            <Button onClick={() => handleSave()} variant="outline-success">
              SALVA
            </Button>
          </div>
        </Alert>
      )}

      {/* Maschere */}
      <Row className="ml-0 mr-0 no-space-row mt-3">
        <h3 className="m-4 mb-1 boldText">Maschere da sci</h3>
      </Row>
      <Row className='mt-4'>
        {allElements.map((prodotto) => {
          if (prodotto.categoria !== 'maschera') return null;
          return (
            <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
              {expandedProductId !== prodotto._id && (
                <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
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
                  <Card.Body>
                    <Card.Title>{prodotto.nome}</Card.Title>
                    <div className='m-0 mb-2' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </div>
                    <div className="border-bottom"></div>
                    <div className='m-1 mt-3 responsive-buttons' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button className='m-1' onClick={() => toggleExpandProduct(prodotto._id)} variant='outline-success'>VARIANTI</Button>
                      <Button className='m-1' onClick={() => handleDelete(prodotto._id)} variant='outline-danger'>ELIMINA</Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {expandedProductId === prodotto._id && (
                <Row key={prodotto._id}>
                  <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                    <Card.Body>
                      <Card.Title><h2>{prodotto?.nome?.toUpperCase()}</h2></Card.Title>
                      <div className="border-bottom"></div>

                      {prodotto?.variants?.map((variante) => (
                        <Row key={variante._id} className='m-0 mb-2'>
                          <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title>{variante?.colore?.toLowerCase()}</Card.Title>
                            <Button onClick={() => handleDeleteVariant(prodotto._id, variante)} variant='danger'>Elimina</Button>
                          </div>
                        </Row>
                      ))}
                      <div className="border-bottom"></div>

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
                          <Button className='m-2' onClick={() => setExpandedProductIdVariant(false)} variant='danger'>Elimina</Button>
                        </Row>
                      )}
                      <div className='m-1 mt-3 responsive-buttons' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='outline-danger'>Indietro</Button>
                        <Button onClick={() => addVariantToProduct(prodotto._id)} variant='outline-success'>Aggiungi</Button>
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
            <Card className='m-3 card-text-prod'>
              <Card.Body>
                <Form onSubmit={(event) => handleSubmit(event, "maschera")}>
                  <Row>
                    <Col sm={4}>
                      <Form.Group controlId="productName">
                        <Form.Label>Nome prodotto</Form.Label>
                        <Form.Control isInvalid={!!errors.nome} type="text" name="nome" value={product.nome} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group controlId="productPrice">
                        <Form.Label>Prezzo</Form.Label>
                        <Form.Control isInvalid={!!errors.prezzo} type="number" name="prezzo" value={product.prezzo} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.prezzo}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group controlId="productColor">
                        <Form.Label>Colore</Form.Label>
                        <Form.Control isInvalid={!!errors.colore} type="text" name="colore" value={product.colore} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.colore}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Form.Group controlId="productDescription">
                      <Form.Label>Descrizione prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.descrizione} as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.descrizione}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productMotto">
                      <Form.Label>Titolo descrizione prodotto aggiuntiva</Form.Label>
                      <Form.Control isInvalid={!!errors.motto} type="text" name="motto" value={product.motto} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.motto}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productCaratteristiche">
                      <Form.Label>Caratteristiche prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.caratteristiche} as="textarea" type="text" rows={1} name="caratteristiche" value={product.caratteristiche} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.caratteristiche}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini copertina - 2 files richiesti (1,2,S,I)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiCop} type="file" multiple onChange={handleImageChangeCop} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiCop}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini variante - 4 files richiesti (B,F,S,D)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiVar} type="file" multiple onChange={handleImageChangeVar} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiVar}</Form.Control.Feedback>
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
            <Button variant="outline-dark" className='m-1 mb-5 button-black-prod button-small-width' onClick={() => setAddMaskProd(true)}>Aggiungi</Button>
          </Col>
        )}
      </Row>

      {/* Occhiali */}

      <Row className="ml-0 mr-0 no-space-row mt-3">
        <h3 className="m-4 mb-1 boldText">Occhiali</h3>
      </Row>
      <Row className='mt-4'>
        {allElements.map((prodotto) => {
          if (prodotto.categoria !== 'occhiale') return null;
          return (
            <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
              {expandedProductId !== prodotto._id && (
                <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
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
                  <Card.Body>
                    <Card.Title>{prodotto.nome}</Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </div>
                    <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button onClick={() => handleDelete(prodotto._id)} variant='danger'>ELIMINA</Button>
                      <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='success'>Varianti</Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {expandedProductId === prodotto._id && (
                <Row key={prodotto._id}>
                  <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                    <Card.Body>
                      <Card.Title>{prodotto?.nome?.toUpperCase()}</Card.Title>
                      {prodotto?.variants?.map((variante) => (
                        <Row key={variante._id}>
                          <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title>{variante?.colore?.toLowerCase()}</Card.Title>
                            <Button onClick={() => handleDeleteVariant(prodotto._id, variante)} variant='danger'>Elimina</Button>
                          </div>
                        </Row>
                      ))}
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
                          <Button className='m-2' onClick={() => setExpandedProductIdVariant(false)} variant='danger'>Elimina</Button>
                        </Row>
                      )}
                      <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='danger'>Indietro</Button>
                        <Button onClick={() => addVariantToProduct(prodotto._id)} variant='success'>Aggiungi</Button>
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
            <Card className='m-3 card-text-prod'>
              <Card.Body>
                <Form onSubmit={(event) => handleSubmit(event, "occhiale")}>
                  <Row>
                    <Col sm={4}>
                      <Form.Group controlId="productName">
                        <Form.Label>Nome prodotto</Form.Label>
                        <Form.Control isInvalid={!!errors.nome} type="text" name="nome" value={product.nome} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group controlId="productPrice">
                        <Form.Label>Prezzo</Form.Label>
                        <Form.Control isInvalid={!!errors.prezzo} type="number" name="prezzo" value={product.prezzo} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.prezzo}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={4}>
                      <Form.Group controlId="productColor">
                        <Form.Label>Colore</Form.Label>
                        <Form.Control isInvalid={!!errors.colore} type="text" name="colore" value={product.colore} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.colore}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Form.Group controlId="productDescription">
                      <Form.Label>Descrizione prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.descrizione} as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.descrizione}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productMotto">
                      <Form.Label>Motto</Form.Label>
                      <Form.Control isInvalid={!!errors.motto} type="text" name="motto" value={product.motto} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.motto}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productCaratteristiche">
                      <Form.Label>Caratteristiche prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.caratteristiche} as="textarea" type="text" rows={1} name="caratteristiche" value={product.caratteristiche} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.caratteristiche}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini copertina - 2 files richiesti (1,2,S,I)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiCop} type="file" multiple onChange={handleImageChangeCop} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiCop}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini variante - 4 files richiesti (B,F,S,D)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiVar} type="file" multiple onChange={handleImageChangeVar} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiVar}</Form.Control.Feedback>
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
            <Button variant="outline-dark" className='m-1 mb-5 button-black-prod button-small-width' onClick={() => setAddGlassProd(true)}>Aggiungi</Button>
          </Col>
        )}
      </Row>

      {/* Accessori */}

      <Row className="ml-0 mr-0 no-space-row mt-3">
        <h3 className="m-4 mb-1 boldText">Accessori</h3>
      </Row>
      <Row className='mt-4'>
        {allElements.map((prodotto) => {
          if (prodotto.categoria === 'occhiale' || prodotto.categoria === 'maschera') return null;
          return (
            <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
              {expandedProductId !== prodotto._id && (
                <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
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
                  <Card.Body>
                    <Card.Title>{prodotto.name}</Card.Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </div>
                    <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button onClick={() => handleDelete(prodotto._id)} variant='danger'>ELIMINA</Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          );
        })}
        {addAccessoryProd ? (
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card className='m-3 card-text-prod'>
              <Card.Body>
                <Form onSubmit={(event) => handleSubmit(event, "")}>
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
                        <Form.Control type="number" name="prezzo" value={product.prezzo} onChange={handleChange} />
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
            <Button variant="outline-dark" className='m-1 mb-5 button-black-prod button-small-width' onClick={() => setAddAccessoryProd(true)}>Aggiungi</Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};
