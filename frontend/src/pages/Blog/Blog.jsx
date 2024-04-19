import React from 'react';
import { useEffect, useState} from 'react';

import { Container,Card, Row, Col, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Blog.css';

export const Blog = () => {

    const [blogPosts, setBlogPosts] = useState([]);
    const getImageById = (id) => {
      return `http://localhost:3000/api/posts/photo-copertina?id=${id}`;
    };

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
      {blogPosts.sort((a, b) => a.position - b.position).map((post, position) => {
          if (position === 0) {
            // Primo post, occupa tutta la larghezza
            return (
              <Col key={position} md={12}>
                <Card className='m-3 card'>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img src={getImageById(post._id)} style={{ width: '100%', height: 'auto' }} />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.description}</Card.Text>
                        <Button as={Link} to={`/BlogArticle/${post._id}`}variant="primary" className="mt-3">Leggi di più</Button>
                      </Card.Body>         
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          } else {
            return (
              <Col key={position} md={4}>
                <Card className='m-3'>
                  <Card.Img variant="top" src={getImageById(post._id)} />
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.description}</Card.Text>
                    <Button as={Link} to={`/BlogArticle/${post._id}`}>Leggi di più</Button>
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