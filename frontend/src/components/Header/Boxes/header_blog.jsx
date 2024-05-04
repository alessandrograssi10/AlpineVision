import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderBlog = ({ onCloseAllBoxes }) => {


    const [articoli, setArticoli] = useState([]);
    const [productsGlass, setProductsGlass] = useState([]);
    const [imgMask, setImgMask] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask
    const [imgGlass, setImgGlass] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask

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
                {/*<Image key={productsMask} src={imgMask} style={{ width: '115px', height: '115px' }}/>*/}
                    <h5 className='bold-text-navbar'>ARTICOLI</h5>
                    {articoli.map(product => (
                    <Link className='text-navbar-box' to={`/BlogArticle/${product._id}`} onClick={onCloseAllBoxes} key={product._id}><div className='text-navbar-box'>{product.title}</div></Link>
                ))}
                </Col>
                
            </Row>
    );
}

export default HeaderBlog;
