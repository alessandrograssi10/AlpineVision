import React from 'react';
import { Container,Card, Row, Col, Button, Image } from 'react-bootstrap';

export const Blog = () => {
    const blogPosts = [
        {
            title: 'The Best Ski Resorts in the Alps',
            image: 'https://example.com/ski-resorts.jpg',
            description: 'Discover the top ski resorts in the Alps and plan your next winter adventure.',
            author: 'John Doe',
            date: 'January 15, 2024',
        },
        {
            title: 'Tips for Beginners: Learning to Ski',
            image: 'https://example.com/learning-to-ski.jpg',
            description: 'If you are new to skiing, check out these helpful tips to get started on the slopes.',
            author: 'Jane Smith',
            date: 'February 5, 2024',
        },
        // Add more blog posts here
    ];

    return (
        <Container>
            <h1>Blog</h1>
            <Row>
                {blogPosts.map((post, index) => (
                    <Col key={index} md={4}>
                        <Card>
                            <Card.Img variant="top" src={post.image} />
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.description}</Card.Text>
                                <Button variant="primary">Read More</Button>
                            </Card.Body>
                            <Card.Footer>
                                <small className="text-muted">
                                    By {post.author} | {post.date}
                                </small>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};