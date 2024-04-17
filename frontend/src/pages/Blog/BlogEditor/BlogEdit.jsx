import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Img from '../../../assets/Images/notfound.png';

export const BlogEdit = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogPostsCopy, setBlogPostsCopy] = useState(false);
  const [blogPostsVerify, setBlogPostsVerify] = useState(false);
  const [Images, setBlogPostsVerify] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts/getAllPosts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogPosts(data);
        setBlogPostsCopy(data);
      } catch (error) {
        console.error("Errore nel recuperare i post del blog:", error);
      }
    };
    fetchBlogPosts();
  }, []);

  
  const handleFileChange = (event, index) => {
    setBlogPostsVerify(true);
    const file = event.target.files[0];
    if (file) {
      const updatedPosts = [...blogPosts];
      if (updatedPosts[index]) {
        updatedPosts[index].ImgCopertina = URL.createObjectURL(file);
        setBlogPosts(updatedPosts);
      } else {
        console.error("Elemento non trovato all'indice specificato:", index);
      }
    }
  };

  const handleTitleChange = (event, index) => {
    setBlogPostsVerify(true);
    const updatedPosts = [...blogPosts];
    updatedPosts[index].title = event.target.value;
    setBlogPosts(updatedPosts);
  };
  
  const handleDescriptionChange = (event, index) => {
    setBlogPostsVerify(true);
    const updatedPosts = [...blogPosts];
    updatedPosts[index].description = event.target.value;
    setBlogPosts(updatedPosts);
  };

  const handleDeleteClick = (index) => {
    setBlogPostsVerify(true);
    const updatedPosts = [...blogPosts];
    updatedPosts.splice(index, 1); // Rimuovi l'elemento dall'array
    setBlogPosts(updatedPosts);
  };
  const handleMoveUpClick = (index) => {
    setBlogPostsVerify(true);
    if (index > 0) { // Verifica se l'elemento è già il primo nella lista
      const updatedPosts = [...blogPosts];
      const temp = updatedPosts[index];
      updatedPosts[index] = updatedPosts[index - 1];
      updatedPosts[index - 1] = temp;
      setBlogPosts(updatedPosts);
    }
  };
  
  const handleMoveDownClick = (index) => {
    setBlogPostsVerify(true);
    if (index < blogPosts.length - 1) { // Verifica se l'elemento è già l'ultimo nella lista
      const updatedPosts = [...blogPosts];
      const temp = updatedPosts[index];
      updatedPosts[index] = updatedPosts[index + 1];
      updatedPosts[index + 1] = temp;
      setBlogPosts(updatedPosts);
    }
  };
  const handleAddArticleClick = () => {
    setBlogPostsVerify(true);
    const newArticle = {
      id: Math.random().toString(36).substr(2, 9), // Genera un ID univoco per il nuovo post
      title: '', // Titolo vuoto, da compilare dall'utente
      description: '', // Descrizione vuota, da compilare dall'utente
      image: Img, // Nessuna immagine di default, l'utente può caricarne una successivamente
      author: '', // Autore vuoto o un valore predefinito
      date: new Date().toISOString().slice(0, 10) // Data attuale come stringa YYYY-MM-DD
    };
    
    setBlogPosts([newArticle, ...blogPosts]); // Aggiungi il nuovo articolo all'inizio dell'array
  };
  const handleDeleteChanges = () => {
    setBlogPostsVerify(false);
    setBlogPosts(blogPostsCopy);
  };

  return (
    <Container>
      <Alert variant={'warning'} className='m-3 mt-4'>
        YOU ARE IN EDIT MODE!!!!!
      </Alert>
      {blogPostsVerify && (
        <Alert variant={'danger'} className='m-3 mt-4 d-flex align-items-center justify-content-between'>
          DO YOU WANNA SAVE YOUR CHANGES?
          <Button onClick={() => handleDeleteChanges()}className="float-end  " variant="outline-danger">
            DISCARD
          </Button>
          <Button className="float-end " variant="outline-success">
            SAVE
          </Button>
        </Alert>
      )}


      <Button 
                        variant="success"
                        className='m-3'
                        onClick={handleAddArticleClick} // Aggiungi l'evento onClick qui

                      >
                        Add Article
                      </Button>
      <Row>
         {blogPosts.sort((a, b) => a.index - b.index).map((post, index) => {
          if (index === 0) {
            // Primo post, occupa tutta la larghezza
            return (
              <Col key={index} md={12}>
                <Card className='m-3'>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img src={post.ImgCopertina} />
                      <input
                type="file"
                onChange={(event) => handleFileChange(event, index)}
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-${index}`}
              />
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          left: '10px' 
                        }}
                        onClick={() => document.getElementById(`file-input-${index}`).click()}
                        variant="primary"
                      >
                        Upload
                      </Button>
                    
                    <Button onClick={() => handleMoveDownClick(index)} // Passa l'indice correntevariant="primary"
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          right: '100px' 
                        }}
                      >
                        Sposta in basso
                      </Button>
                
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          right: '10px' 
                        }}
                        onClick={() => handleDeleteClick(index)} // Passa l'indice corrente
                        variant="danger"
                      >
                        Elimina
                      </Button>
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" value={post.title} placeholder="Title" onChange={(event) => handleTitleChange(event, index)} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                          <Form.Control as="textarea" rows={3} value={post.description} placeholder="Short description"style={{ resize: 'none' }} onChange={(event) => handleDescriptionChange(event, index)} />
                        </Form.Group>
                        <Button as={Link} to={`/BlogArticleEdit/${post.id}`} variant="primary" className="mt-3">
                          Leggi di più
                        </Button>                
                      </Card.Body>         
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          } else {
            // Altri post, disposti in colonne di un terzo della larghezza
            return (
              <Col key={index} md={4}>
                <Card className='m-3'>
                  <Card.Img variant="top" src={post.ImgCopertina} />
                  
                  <Card.Body>
                  <input
                type="file"
                onChange={(event) => handleFileChange(event, index)}
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-${index}`}
              />
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          left: '10px' 
                        }}
                        onClick={() => document.getElementById(`file-input-${index}`).click()}
                        variant="primary"
                      >
                        Upload
                      </Button>
                  <Form.Group className="mb-3">
                          <Form.Control type="text" value={post.title} placeholder="Title"onChange={(event) => handleTitleChange(event, index)} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                          <Form.Control as="textarea" rows={3} value={post.description} placeholder="Short description"style={{ resize: 'none' }} onChange={(event) => handleDescriptionChange(event, index)} />
                        </Form.Group>
                    <Link to={`/BlogArticleEdit/${post.id}`}>Leggi di più</Link>
                    
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      By {post.author} | {post.date}
                    </small>     
                  </Card.Footer>
                  <Row>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Button 
    onClick={() => handleMoveUpClick(index)} // Passa l'indice corrente
    variant="primary"
                        className='m-2 d-inline-block w-100' 
                      >
                        Sposta in alto
                      </Button>
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Button 
    onClick={() => handleMoveDownClick(index)} // Passa l'indice corrente
    variant="primary"
                        className='m-2 d-inline-block w-100' 
                      >
                        Sposta in basso
                      </Button>
                    </Col>
               
                  </Row>
                  
                  <Button 
                        onClick={() => handleDeleteClick(index)} // Passa l'indice corrente
                        variant="danger"
                        className='m-2'
                      >
                        Delete
                      </Button>
                </Card>
              </Col>
            );
          }
        })}
      </Row>
    </Container>
  );
};
