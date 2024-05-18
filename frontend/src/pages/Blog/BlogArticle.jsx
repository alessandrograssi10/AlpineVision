import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

export const BlogArticle = () => {
  const { id } = useParams(); // Id del post passato tramite URL
  const [post, setPost] = useState(null); // Dati del post

  // Immagine recuperata dal backend tramite id
  const getImageById = (id) => {
    return `http://localhost:3000/api/posts/photo-contenuto?id=${id}`;
  };

  const getImageByIdCop = (id) => {
    return `http://localhost:3000/api/posts/photo-copertina?id=${id}`;
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/getAllPosts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Filtriamo i dati ricevuti per trovare il post con l'ID corretto
        const postFound = data.find((post) => post._id === id);
        setPost(postFound); // Salviamo il post trovato
      })
      .catch((error) => {
        console.error("Errore nel recupero dell'articolo:", error);
      });
  }, [id]); // Dipendenza di useEffect

  if (!post) {
    return <div>Caricamento...</div>;
  }

  return (
    <Container fluid className="m-0 p-0">
      <Row className="m-0 p-0 h-10 no-space-rowBg img-cop-blog">
        <Image
          src={getImageByIdCop(post._id)}
          className="img-cop-blog p-0 img-fluid-no-space h-10 darkness"
        />
        <div className="centered-text">
          <h1>{post.title}</h1>
        </div>
      </Row>

      <Row className="mt-5 justify-content-center m-5">
        <h5 className="text-center">{post.content.part1}</h5>
      </Row>

      <Row className="my-2 justify-content-center">
        <h1 className="text-center">{post.content.part2.title}</h1>
      </Row>

      <Row className="mt-5 justify-content-center m-5">
        <h5 className="text-center">{post.content.part2.body}</h5>
      </Row>

      <Row className="my-2 justify-content-center">
        <Image src={getImageById(post._id)} fluid className="mb-3 img-maxH" />
      </Row>

      <Row className="mt-5 justify-content-center m-5">
        <h1 className="text-center">{post.content.part3.title}</h1>
      </Row>

      <Row className="mt-5 justify-content-center m-5">
        <h5 className="text-center">{post.content.part3.body}</h5>
      </Row>

      <Row className="my-2 mt-4 justify-content-center">
        <p className="text-muted text-center">
          Pubblicato il {new Date(post.date).toLocaleDateString()}
        </p>
      </Row>

      <Row className="my-2 justify-content-center">
        <Col lg={6} className="d-flex justify-content-center mb-3">
          <Button as={Link} to="/Blog" variant="outline-dark" className=" button button-black-prod btn-lg mt-5">
            Torna ai post
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
