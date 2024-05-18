import React, {useState ,useLayoutEffect} from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Blog.css';

export const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]); // Variabile di stato per memorizzare gli articoli del blog

  // Funzione per ottenere l'URL dell'immagine di copertina dell'articolo
  const getImageById = (id) => {
    return `http://localhost:3000/api/posts/photo-copertina?id=${id}`;
  };

  
  useLayoutEffect(() => {
    //let g = localStorage.getItem("ruolo");

    const fetchBlogPosts = async () => {
      try {
        // Effettua una richiesta per ottenere tutti gli articoli del blog
        const response = await fetch('http://localhost:3000/api/posts/getAllPosts');
        if (!response.ok) {
          throw new Error('Errore durante il recupero dei post del blog');
        }
        const data = await response.json(); // Converte la risposta in formato JSON
        setBlogPosts(data); // Salva i dati
      } catch (error) {
        console.error("Errore nel recuperare i post del blog:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <Container fluid className="p-0 m-0">
      <Row className='mt-0 m-0 p-0 w-100 d-flex flex-grow-1'>
        {/* Ordina e mappa i post del blog */}
        {blogPosts.sort((a, b) => a.position - b.position).map((post, index) => (
          <Col key={index}  sm={12} md={6} lg={4}  className='m-0 p-0 '>
            <Card as={Link} to={`/BlogArticle/${post._id}`} className='card-blog m-0 p-0'>
              <div className="zoom-image">
                {/* Immagine di copertina del post */}
                <Card.Img className='zoom-image m-0 p-0 img-car-blog' variant="top" src={getImageById(post._id)} />
              </div>
              <Card.Title className='centered-text centered-text-blog'>
                <h2>{post.title}</h2>
              </Card.Title>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
