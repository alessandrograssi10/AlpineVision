import React, { useState, useEffect } from 'react';
import { Form, Image, Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { GetAllProducts, GetAllAccessory, saveAll } from '../../assets/Scripts/Editor/GetFromData.js';
import { getUserRole } from '../../assets/Scripts/GetUserInfo.js';

import './Editor.css';

export const Editor = () => {
  
  const userId = localStorage.getItem('userId'); 
  const [ruolo, setRuolo] = useState(null);

  console.log("Ruolo", ruolo)

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
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [expandedProductIdVariant, setExpandedProductIdVariant] = useState(false);

  const [copiedOnce, setCopiedOnce] = useState(false);
  const [riavvia, setRiavvia] = useState(false);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    console.log("useEffect eseguito con userId:", userId);
    if (!userId) {
      console.log('UserID non disponibile');
      window.location.href = '/home';
      return;
    }
  
    (async () => {
      try {
        console.log("Chiamata a getUserRole iniziata con userId:", userId);
        const fetchedRole = await getUserRole(userId);
        if(!fetchedRole) setRuolo("user");
        else setRuolo(fetchedRole);
      } catch (error) {
        console.error('Errore durante il recupero del ruolo:', error);
        setRuolo("user");
      }
    })();
  }, [userId]);

  // Controlli basati sul ruolo
  useEffect(() => {
    if (ruolo && ruolo !== "admin" && ruolo !== "editor-prodotti") {
      window.location.href = '/home';
    }
  }, [ruolo]);

  // Effettua una copia iniziale degli elementi una sola volta
  useEffect(() => {
    if (!copiedOnce) {
      setAllElementsCopy(allElements);
      console.log("allElements updated:", allElements);
      setCopiedOnce(true);
    }
  }, [allElements]);

  // Carica i dati dal server all'avvio
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

  // Gestione cambiamento del form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Funzione per eliminare una variante di prodotto
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

  // Funzione per eliminare un prodotto
  const handleDelete = (productId) => {
    setElementsVerify(true);
    const updatedAllElements = allElements.filter(element => element._id !== productId);
    setAllElements(updatedAllElements);
  };

  // Gestione cambio immagini copertina
  const handleImageChangeCop = (event) => {
    const { files } = event.target;
    setProduct(prevState => ({
      ...prevState,
      immaginiCop: [...files]
    }));
  };

  // Gestione cambio immagini variante
  const handleImageChangeVar = (event) => {
    const { files } = event.target;
    setProduct(prevState => ({
      ...prevState,
      immaginiVar: [...files]
    }));
  };

  // Apertura form di aggiunta prodotto
  const OpenAdd = (type) => {
    if(type === "maschera") {
      setAddMaskProd(true);
      setAddGlassProd(false);
      setAddAccessoryProd(false);
    } else if(type === "occhiale") {
      setAddMaskProd(false);
      setAddGlassProd(true);
      setAddAccessoryProd(false);
    } else if(type === "accessorio") {
      setAddMaskProd(false);
      setAddGlassProd(false);
      setAddAccessoryProd(true);
    }
    // Reset del form
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
    setErrors({});
  }

  // Gestione invio form
  const handleSubmit = (event, type) => {
    console.log("Submit Type:", type);
    event.preventDefault();

    if (type === 'maschera' || type === 'occhiale') {
      const validationErrors = validateFormProd();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    } else {
      const validationErrors = validateFormAcc();

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
      quantita,
    };
    newProduct.variants.push(variant);

    console.log(newProduct);
    setAllElements([...allElements, newProduct]);
    setAddMaskProd(false);
    setAddGlassProd(false);
    setAddAccessoryProd(false);

    // Reset del form
    setProduct({
      nome: '',
      prezzo: '',
      descrizione: '',
      colore: '',
      coloreVariante: '',
      quantita: 0,
      immaginiCop: [],
      immaginiVar: [],
      motto: ''
    });
  };

  // Toggle espansione prodotto
  const toggleExpandProduct = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
      setExpandedProductIdVariant(false);
    } else {
      setExpandedProductId(productId);
    }
  };

  // Aggiungi variante al prodotto
  const addVariantToProduct = (productId) => {
    setElementsVerify(true);
    if (!expandedProductIdVariant) {
      setExpandedProductIdVariant(true);
      setErrors({});
      return;
    }
    const validationErrors = validateFormVar();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const { coloreVariante, immaginiVar } = product;

    const newVariant = {
      _id: Math.random().toString(36).substring(2),
      productId: productId,
      colore: coloreVariante,
      immaginiVar,
      quantita: product.quantita,
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

  // Salva modifiche
  const handleSave = () => {
    setElementsVerify(false);
    saveAll(allElements, allElementsCopy);
    setTimeout(() => {
      setRiavvia(!riavvia);
    }, 500);
  };

  // Ricarica pagina
  const handleReload = () => {
    setElementsVerify(false);
    setTimeout(() => {
      setRiavvia(!riavvia);
    }, 500);
  };

  // Validazione form prodotti
  const validateFormProd = () => {
    const newErrors = {};
    if (!product.nome) newErrors.nome = 'Nome del prodotto è richiesto.';
    if (!product.prezzo || product.prezzo <= 0) newErrors.prezzo = 'Prezzo non valido.';
    if (!product.quantita || product.quantita <= 0) newErrors.quantita = 'Quantità non valida.';
    if (!product.colore) newErrors.colore = 'Colore del prodotto non valido.';
    if (!product.descrizione) newErrors.descrizione = 'Descrizione del prodotto non valida.';
    if (!product.motto || product.motto <= 0) newErrors.motto = 'Titolo descrizione del prodotto non valido.';
    if (!product.caratteristiche || product.caratteristiche <= 0) newErrors.caratteristiche = 'Caratteristiche del prodotto non valide.';
    if (!product.immaginiCop || product.immaginiCop.length !== 2) newErrors.immaginiCop = '2 immagini richieste.';
    if (!product.immaginiVar || product.immaginiVar.length !== 4) newErrors.immaginiVar = '4 immagini richieste.';
    return newErrors;
  };

  // Validazione form varianti
  const validateFormVar = () => {
    const newErrors = {};
    if (!product.coloreVariante) newErrors.coloreVariante = 'Colore del prodotto non valida.';
    if (!product.immaginiVar || product.immaginiVar.length !== 4) newErrors.immaginiVar = '4 immagini richieste.';
    if (!product.quantita || product.quantita <= 0) newErrors.quantita = 'Quantità non valida.';
    return newErrors;
  };

  // Validazione form accessori
  const validateFormAcc = () => {
    const newErrors = {};
    if (!product.nome) newErrors.nome = 'Nome del prodotto non valido.';
    if (!product.prezzo || product.prezzo <= 0) newErrors.prezzo = 'Prezzo non valido.';
    if (!product.descrizione) newErrors.descrizione = 'Descrizione del prodotto non valida.';
    if (!product.immaginiCop || product.immaginiCop.length !== 4) newErrors.immaginiCop = '4 immagini richieste.';
    if (!product.quantita || product.quantita <= 0) newErrors.quantita = 'Quantità non valida.';
    return newErrors;
  };

  
  if (ruolo !== "admin" && ruolo !== "editor-prodotti") {
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
                      <Button className='m-1' onClick={() => handleDelete(prodotto._id)} variant='outline-danger'>ELIMINA</Button>
                      <Button className='m-1' onClick={() => toggleExpandProduct(prodotto._id)} variant='outline-success'>VARIANTI</Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {expandedProductId === prodotto._id && (
                <Row key={prodotto._id}>
                  <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                    <Card.Body>
                      <Card.Title><h3>{prodotto?.nome}</h3></Card.Title>
                      {prodotto?.variants?.map((variante) => (
                        <Row key={variante._id} className='m-0 mb-2'>
                          <div className="border-bottom"></div>
                          <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title>{variante?.colore?.toLowerCase()}</Card.Title>
                            <Card.Title>x {variante?.quantita}</Card.Title>

                            <Button onClick={() => handleDeleteVariant(prodotto._id, variante)} variant='outline-danger'>Elimina</Button>
                          
                          </div>

                        </Row>
                      ))}
                      <div className="border-bottom"></div>
                      {expandedProductIdVariant && (
                        <Row className="border-top m-2">
                          <Form.Group controlId="productName m-2">
                            <Form.Label>Colore variante</Form.Label>
                            <Form.Control isInvalid={!!errors.coloreVariante} type="text" name="coloreVariante" value={product.coloreVariante} onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">{errors.coloreVariante}</Form.Control.Feedback>
                            <Form.Group controlId="productImages">
                              <Form.Label>Immagini variante - 4 files richiesti (Posteriore, Frontale, Sinistra, Destra)</Form.Label>
                              <Form.Control isInvalid={!!errors.immaginiVar} type="file" multiple onChange={handleImageChangeVar} />
                              <Form.Control.Feedback type="invalid">{errors.immaginiVar}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                          </Form.Group>
                          <Button className='m-2' onClick={() => setExpandedProductIdVariant(false)} variant='outline-danger'>Elimina</Button>
                        </Row>
                      )}
                      <div className='m-1 mt-3 responsive-buttons' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='outline-dark'>Indietro</Button>
                        <Button onClick={() => addVariantToProduct(prodotto._id)} variant='outline-success'>AGGIUNGI</Button>
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
                    <Form.Group controlId="productMotto">
                      <Form.Label>Titolo descrizione</Form.Label>
                      <Form.Control isInvalid={!!errors.motto} type="text" name="motto" value={product.motto} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.motto}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productDescription">
                      <Form.Label>Descrizione prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.descrizione} as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.descrizione}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productCaratteristiche">
                      <Form.Label>Caratteristiche prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.caratteristiche} as="textarea" type="text" rows={1} name="caratteristiche" value={product.caratteristiche} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.caratteristiche}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini copertina - 2 files richiesti (S,I)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiCop} type="file" multiple onChange={handleImageChangeCop} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiCop}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini variante - 4 files richiesti (Posteriore, Frontale, Sinistra, Destra)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiVar} type="file" multiple onChange={handleImageChangeVar} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiVar}</Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                      <Button className='m-0 mt-4 button-small-width' variant="outline-success" type="submit">
                        Invia
                      </Button>
                    </div>
                  </Row>
                </Form>
                <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button onClick={() => setAddMaskProd(false)} variant='outline-danger'>ELIMINA</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col xs={12} sm={12} md={12} lg={12} className="d-flex align-items-center justify-content-center m-0 mt-5" style={{ height: '100%' }}>
            <Button variant="outline-dark" className='m-1 mb-5 button-black-prod button-small-width' onClick={() => OpenAdd("maschera")}>AGGIUNGI</Button>
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
                    <div className='m-1 mt-3 responsive-buttons' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button className='m-1' onClick={() => handleDelete(prodotto._id)} variant='outline-danger'>ELIMINA</Button>
                      <Button className='m-1' onClick={() => toggleExpandProduct(prodotto._id)} variant='outline-success'>VARIANTI</Button>
                    </div>
                  </Card.Body>
                </Card>
              )}
              {expandedProductId === prodotto._id && (
                <Row key={prodotto._id}>
                  <Card className='m-3 card-text-prod card-prod card-prod-prod-ca'>
                    <Card.Body>
                      <Card.Title><h3>{prodotto?.nome}</h3></Card.Title>
                      {prodotto?.variants?.map((variante) => (
                        <Row key={variante._id} className='m-0 mb-2'>
                          <div className="border-bottom"></div>
                          <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title>{variante?.colore?.toLowerCase()}</Card.Title>
                            <Card.Title>x {variante?.quantita}</Card.Title>

                            <Button onClick={() => handleDeleteVariant(prodotto._id, variante)} variant='outline-danger'>Elimina</Button>
                          
                          </div>

                        </Row>
                      ))}
                      <div className="border-bottom"></div>
                      {expandedProductIdVariant && (
                        <Row className="border-top m-2">
                          <Form.Group controlId="productName m-2">
                            <Form.Label>Colore variante</Form.Label>
                            <Form.Control isInvalid={!!errors.coloreVariante} type="text" name="coloreVariante" value={product.coloreVariante} onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">{errors.coloreVariante}</Form.Control.Feedback>
                            <Form.Group controlId="productImages">
                              <Form.Label>Immagini variante - 4 files richiesti (Posteriore, Frontale, Sinistra, Destra)</Form.Label>
                              <Form.Control isInvalid={!!errors.immaginiVar} type="file" multiple onChange={handleImageChangeVar} />
                              <Form.Control.Feedback type="invalid">{errors.immaginiVar}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                          </Form.Group>
                          <Button className='m-2' onClick={() => setExpandedProductIdVariant(false)} variant='outline-danger'>Elimina</Button>
                        </Row>
                      )}
                         <div className='m-1 mt-3 responsive-buttons' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button onClick={() => toggleExpandProduct(prodotto._id)} variant='outline-dark'>Indietro</Button>
                        <Button onClick={() => addVariantToProduct(prodotto._id)} variant='outline-success'>AGGIUNGI</Button>
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
                      <Form.Label>Titolo Caratteristiche</Form.Label>
                      <Form.Control isInvalid={!!errors.motto} type="text" name="motto" value={product.motto} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.motto}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productCaratteristiche">
                      <Form.Label>Caratteristiche prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.caratteristiche} as="textarea" type="text" rows={1} name="caratteristiche" value={product.caratteristiche} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.caratteristiche}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini copertina - 2 files richiesti (S,I)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiCop} type="file" multiple onChange={handleImageChangeCop} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiCop}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini variante - 4 files richiesti (Posteriore, Frontale, Sinistra, Destra)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiVar} type="file" multiple onChange={handleImageChangeVar} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiVar}</Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                      <Button className='m-0 mt-4 button-small-width' variant="outline-success" type="submit">
                        Invia
                      </Button>
                    </div>
                  </Row>
                </Form>
                <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button onClick={() => setAddGlassProd(false)} variant='outline-danger'>ELIMINA</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col xs={12} sm={12} md={12} lg={12} className="d-flex align-items-center justify-content-center m-0 mt-5" style={{ height: '100%' }}>
            <Button variant="outline-dark" className='m-1 mb-5 button-black-prod button-small-width' onClick={() => OpenAdd("occhiale")}>AGGIUNGI</Button>
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
                      <Card.Text>Quantità: {prodotto.quantita}</Card.Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Card.Text>{prodotto.prezzo} €</Card.Text>
                    </div>

                    <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button onClick={() => handleDelete(prodotto._id)} variant='outline-danger'>ELIMINA</Button>
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
                        <Form.Control isInvalid={!!errors.nome} type="text" name="nome" value={product.nome} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.nome}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="productPrice">
                        <Form.Label>Prezzo</Form.Label>
                        <Form.Control isInvalid={!!errors.prezzo} type="number" name="prezzo" value={product.prezzo} onChange={handleChange} />
                        <Form.Control.Feedback type="invalid">{errors.prezzo}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Form.Group controlId="productDescription">
                      <Form.Label>Descrizione prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.descrizione} as="textarea" rows={1} type="text" name="descrizione" value={product.descrizione} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.descrizione}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productQuantity">
                      <Form.Label>Quantità prodotto</Form.Label>
                      <Form.Control isInvalid={!!errors.quantita} type="number" name="quantita" value={product.quantita} onChange={handleChange} />
                      <Form.Control.Feedback type="invalid">{errors.quantita}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="productImages">
                      <Form.Label>Immagini copertina - 4 files (Posteriore, Frontale, Sinistra, Destra)</Form.Label>
                      <Form.Control isInvalid={!!errors.immaginiCop} type="file" multiple onChange={handleImageChangeCop} />
                      <Form.Control.Feedback type="invalid">{errors.immaginiCop}</Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                      <Button className='m-0 mt-4 button-small-width' variant="outline-success" type="submit">
                        Invia
                      </Button>
                    </div>
                  </Row>
                </Form>
                <div className='m-1 mt-3' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button onClick={() => setAddAccessoryProd(false)} variant='outline-danger'>ELIMINA</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col xs={12} sm={12} md={12} lg={12} className="d-flex align-items-center justify-content-center m-0 mt-5" style={{ height: '100%' }}>
            <Button variant="outline-dark" className='m-1 mb-5 button-black-prod button-small-width' onClick={() => OpenAdd("accessorio")}>AGGIUNGI</Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};
