import React, { useEffect, useState } from 'react';
import { Container,Card, Row, Col, Button, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const BlogArticle = () => {
  const { id } = useParams(); // Id del post passato tramite URL
  const [post, setPost] = useState(null); // Dati del post

  // Immagine recuperata dal backend tramite id
  const getImageById = (id) => {
    return `http://localhost:3000/api/posts/photo-contenuto?id=${id}`;
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/getAllPosts`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Filtriamo i dati ricevuti per trovare il post con l'ID corretto
        const postFound = data.find(post => post._id === id);
        console.log('Post ricevuto:', postFound); // Verifica i dati del post trovato
        setPost(postFound); // Salviamo il post trovato
      })
      .catch(error => {
        console.error("Errore nel recupero dell'articolo:", error);
      });
  }, [id]); // Dipendenza di useEffect

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
      <p className="text-muted text-center">{post.content.part1}</p>

      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={6}>
          <Image src={getImageById(post._id)} alt={post.title} fluid className="mb-3" />
        </Col>
        <Col lg={6}>
          <Row><h3>{post.content.part2.title}</h3></Row>
          <Row>
          <p className="text-muted">{post.content.part2.body}</p>
         </Row>
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={12}>
        <Row><h3 className=' text-left mt-3'>{post.content.part3.title}</h3></Row>
          <Row>
          <p className="text-muted">{post.content.part2.body}</p>
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
