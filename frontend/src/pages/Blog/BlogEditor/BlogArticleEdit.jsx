import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image,Form,Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const BlogArticleEdit = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [postCopy, setPostCopy] = useState(false);
  const [postVerify, setPostVerify] = useState(false);

  useEffect(() => {
    console.log(`Caricamento dei dettagli per il post con ID: ${id}`); // Verifica l'ID
    axios.get(`http://localhost:3020/blog-posts/${id}`)
      .then(response => {
        console.log('Post ricevuto:', response.data); // Verifica i dati ricevuti
        setPost(response.data);
        setPostCopy(response.data);
      })
      .catch(error => {
        console.error("Errore nel recupero dell'articolo:", error);
      });
  }, [id]);

  if (!post) {
    console.log('Caricamento o nessun post trovato');
    return <div>Caricamento...</div>;
  }

  const handleChange = (event,parte) => {
    setPostVerify(true);
    const updatedPost = {
      ...post,
      [parte]: event.target.value,
    };
    setPost(updatedPost);
  };


  const handleDeleteChanges = () => {
    setPostVerify(false);
    setPost(postCopy);
  };

  return (
    <Container>
        <Alert variant={'warning'} className='m-0 mt-4'>
        YOU ARE IN EDIT MODE!!!!!
      </Alert>
      {postVerify && (
        <Alert variant={'danger'} className='m-0 mt-4 d-flex align-items-center justify-content-between'>
          DO YOU WANNA SAVE YOUR CHANGES?
          <Button onClick={() => handleDeleteChanges()}className="float-end  " variant="outline-danger">
            DISCARD
          </Button>
          <Button className="float-end " variant="outline-success">
            SAVE
          </Button>
        </Alert>
      )}
      <Row className="my-2 mt-4 justify-content-center">
      <Col lg={12}className="text-center"> <h1><Form.Group className="mb-3">
                          <Form.Control type="text" value={post.title} placeholder="Title" onChange={(event) => handleChange(event,'title')} />
                        </Form.Group></h1></Col>
      </Row>
      <Row className="my-2 mt-4 justify-content-center">
      <p className="text-muted text-center">Pubblicato il {new Date(post.date).toLocaleDateString()}</p>

      </Row>
      <Row className="my-2 mt-4 justify-content-center">
      <Form.Group className="mb-3">
                          <Form.Control as="textarea" rows={3} type="text" value={post.Art_p1} placeholder="Parte 1" onChange={(event) => handleChange(event,'Art_p1')} />
                        </Form.Group>

      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={6}>
          {post.image && (
            <Image src={post.image} alt={post.title} fluid className="mb-3" />
          )}
        </Col>
        <Col lg={6}>
          <Row><h3> <Form.Group className="mb-3">
                          <Form.Control  type="text" value={post.Art_p2_title} placeholder="Parte 2 Title" onChange={(event) => handleChange(event,'Art_p2_title')} />
                        </Form.Group>
</h3></Row>
          <Row>
          <p className="text-muted"><Form.Group className="mb-3">
                          <Form.Control  type="text" as="textarea" rows={12} value={post.Art_p2} placeholder="Parte 2" onChange={(event) => handleChange(event,'Art_p2')} />
                        </Form.Group></p>
         </Row>
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={12}>
        <Row><h3 className=' text-left mt-3'><Form.Group className="mb-3">
                          <Form.Control  type="text" value={post.Art_p3_title} placeholder="Parte 3 Title" onChange={(event) => handleChange(event,'Art_p3_title')} />
                        </Form.Group></h3></Row>
          <Row>
          <p className="text-muted"><Form.Group className="mb-3">
                          <Form.Control  type="text" as="textarea" rows={7} value={post.Art_p3} placeholder="Parte 3" onChange={(event) => handleChange(event,'Art_p3')} />
                        </Form.Group></p>
         </Row>
         
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={6} className="d-flex justify-content-center mb-3">
          <Button as={Link} to={`/BlogEdit`} variant="primary" className="mt-3">Torna ai post</Button>
        </Col>
      </Row>
    </Container>
  );
};
