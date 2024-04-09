import React, { useEffect, useState } from 'react';
import { Container,Card, Row, Col, Button, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const BlogArticle = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    console.log(`Caricamento dei dettagli per il post con ID: ${id}`); // Verifica l'ID
    axios.get(`http://localhost:3020/blog-posts/${id}`)
      .then(response => {
        console.log('Post ricevuto:', response.data); // Verifica i dati ricevuti
        setPost(response.data);
      })
      .catch(error => {
        console.error("Errore nel recupero dell'articolo:", error);
      });
  }, [id]);

  if (!post) {
    console.log('Caricamento o nessun post trovato');
    return <div>Caricamento...</div>;
  }

  return (
    <Container>
      <Row className="my-2 mt-4 justify-content-center">
      <Col lg={12}className="text-center"> <h1>{post.title}</h1></Col>
      </Row>
      <Row className="my-2 mt-4 justify-content-center">
      <p className="text-muted text-center">Pubblicato il {new Date(post.date).toLocaleDateString()}</p>

      </Row>
      <Row className="my-2 mt-4 justify-content-center">
      <p className="text-muted text-center">{post.Art_p1}</p>

      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={6}>
          {post.image && (
            <Image src={post.image} alt={post.title} fluid className="mb-3" />
          )}
        </Col>
        <Col lg={6}>
          <Row><h3>{post.Art_p2_title}</h3></Row>
          <Row>
          <p className="text-muted">{post.Art_p2}</p>
         </Row>
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={12}>
        <Row><h3 className=' text-left mt-3'>{post.Art_p3_title}</h3></Row>
          <Row>
          <p className="text-muted">{post.Art_p3}</p>
         </Row>
         
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={6} className="d-flex justify-content-center mb-3">
          <Button as={Link} to={`/Blog`} variant="primary" className="mt-3">Torna ai post</Button>
        </Col>
      </Row>
    </Container>
  );
};
