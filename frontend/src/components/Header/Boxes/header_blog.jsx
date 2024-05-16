import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderBlog = ({ onCloseAllBoxes }) => {
    const [articoli, setArticoli] = useState([]);

    // Prendo le informazioni dal backend e le salvo in productAccessories
    useEffect(() => {
        fetch(`http://localhost:3000/api/posts/getAllPosts`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            setArticoli(data);
          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));
      }, []);
      
  
        return (
            <Row className='m-5 mt-1 mb-3'>
                <Col md={4} className="d-flex flex-column">
                    <h5 className='bold-text-navbar'>ARTICOLI</h5>

                    {/* Visualizzazioni in link degli articoli */}

                    {articoli.map(product => (
                    <Link className='text-navbar-box' to={`/BlogArticle/${product._id}`} onClick={onCloseAllBoxes} key={product._id}><div className="text-box-prod">{product.title}</div></Link>
                ))}
                </Col>
            </Row>
    );
}

export default HeaderBlog;
