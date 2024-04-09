import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const BlogEdit = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3020/blog-posts');
        setBlogPosts(response.data);
      } catch (error) {
        console.error("Errore nel recuperare i post del blog:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  

  const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      const updatedPosts = [...blogPosts];
      if (updatedPosts[index]) {
        updatedPosts[index].image = URL.createObjectURL(file);
        setBlogPosts(updatedPosts);
      } else {
        console.error("Elemento non trovato all'indice specificato:", index);
      }
    }
  };

  const handleTitleChange = (event, index) => {
    const updatedPosts = [...blogPosts];
    updatedPosts[index].title = event.target.value;
    setBlogPosts(updatedPosts);
  };
  
  const handleDescriptionChange = (event, index) => {
    const updatedPosts = [...blogPosts];
    updatedPosts[index].description = event.target.value;
    setBlogPosts(updatedPosts);
  };

  const handleDeleteClick = (index) => {
    const updatedPosts = [...blogPosts];
    updatedPosts.splice(index, 1); // Rimuovi l'elemento dall'array
    setBlogPosts(updatedPosts);
  };
  const handleMoveUpClick = (index) => {
    if (index > 0) { // Verifica se l'elemento è già il primo nella lista
      const updatedPosts = [...blogPosts];
      const temp = updatedPosts[index];
      updatedPosts[index] = updatedPosts[index - 1];
      updatedPosts[index - 1] = temp;
      setBlogPosts(updatedPosts);
    }
  };
  
  const handleMoveDownClick = (index) => {
    if (index < blogPosts.length - 1) { // Verifica se l'elemento è già l'ultimo nella lista
      const updatedPosts = [...blogPosts];
      const temp = updatedPosts[index];
      updatedPosts[index] = updatedPosts[index + 1];
      updatedPosts[index + 1] = temp;
      setBlogPosts(updatedPosts);
    }
  };

  return (
    <Container>
      <Alert variant={'warning'} className='mt-3'>
        YOU ARE IN EDIT MODE!!!!!
      </Alert>
      
      <Row>
        {blogPosts.map((post, index) => {
          if (index === 0) {
            // Primo post, occupa tutta la larghezza
            return (
              <Col key={index} md={12}>
                <Card className='m-3'>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img src={post.image} style={{ width: '100%', height: 'auto' }} />
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
                          <Form.Control type="text" value={post.title} onChange={(event) => handleTitleChange(event, index)} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                          <Form.Control as="textarea" rows={3} value={post.description} style={{ resize: 'none' }} onChange={(event) => handleDescriptionChange(event, index)} />
                        </Form.Group>
                        <Button as={Link} to={`/BlogArticle/${post.id}`} variant="primary" className="mt-3">
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
                  <Card.Img variant="top" src={post.image} />
                  
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
                          <Form.Control type="text" value={post.title} onChange={(event) => handleTitleChange(event, index)} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                          <Form.Control as="textarea" rows={3} value={post.description} style={{ resize: 'none' }} onChange={(event) => handleDescriptionChange(event, index)} />
                        </Form.Group>
                    <Link to={`/BlogArticle/${post.id}`}>Leggi di più</Link>
                    
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
