import React from 'react';
import { useEffect, useState} from 'react';

import { Container,Card, Row, Col, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Blog = () => {

    const [blogPosts, setBlogPosts] = useState([]);


    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/posts/getAllPosts');
                console.log(response);
                setBlogPosts(response.data);
            } catch (error) {
                console.error("Errore nel recuperare i post del blog:", error);
            }
        };

        fetchBlogPosts();
    }, []);
   

    return (
        <Container>
      <Row className='mt-4'>
        {blogPosts.map((post, index) => {
          if (index === 0) {
            // Primo post, occupa tutta la larghezza
            return (
              <Col key={index} md={12}>
                <Card className='m-3'>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img src={post.image} style={{ width: '100%', height: 'auto' }} />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.description}</Card.Text>
                        <Button as={Link} to={`/BlogArticle/${post.id}`}variant="primary" className="mt-3">Leggi di più</Button>
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