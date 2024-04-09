import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Alert } from 'react-bootstrap';
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

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Simula il click sull'input file quando il pulsante viene premuto
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Puoi aggiungere qui la logica per gestire l'upload del file
      console.log("File caricato:", file);
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
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*" 
                      />
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          left: '10px' 
                        }}
                        onClick={handleButtonClick}
                        variant="primary"
                      >
                        Pulsante
                      </Button>
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.description}</Card.Text>
                        <Button as={Link} to={`/BlogArticle/${post.id}`} variant="primary" className="mt-3">Leggi di più</Button>
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
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.description}</Card.Text>
                    <Link to={`/BlogArticle/${post.id}`}>Leggi di più</Link>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      By {post.author} | {post.date}
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            );
          }
        })}
      </Row>
    </Container>
  );
};
