import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Header } from './header.js';

export const HeaderProducts = ({ onCloseAllBoxes }) => {


    const [productsMask, setProductsMask] = useState([]);
    const [productsGlass, setProductsGlass] = useState([]);
    const [imgMask, setImgMask] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask
    const [imgGlass, setImgGlass] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask

    useEffect(() => {
        fetch(`http://localhost:3000/api/products`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            const filteredProducts = data.filter(product => product.type === "prodotto");
            const masks = filteredProducts.filter(product => product.categoria === "maschera");
            const glasses = filteredProducts.filter(product => product.categoria === "occhiale");
            setProductsMask(masks);
            setProductsGlass(glasses);
            const imgMaskValue = `http://localhost:3000/api/products/${masks[0]?._id}/verde/frontale`;
            const imgGlassValue = `http://localhost:3000/api/products/${glasses[0]?._id}/verde/frontale`;

            setImgMask(imgMaskValue);
            setImgGlass(imgGlassValue);

          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));
      }, []);
      
  
        return (
            <Row>
                <Col md={4} className="d-flex flex-column">
                <Image key={productsMask} src={imgMask} style={{ width: '115px', height: '115px' }}/>

                    <h4>MASCHERE</h4>
                    {productsMask.map(product => (
                    <Link to={`/product/${product._id}`} onClick={onCloseAllBoxes} key={product._id}>{product.nome}</Link>
                ))}
                </Col>
                <Col md={4} className="d-flex flex-column">
                <Image key={productsMask} src={imgGlass} style={{ width: '115px', height: '115px' }}/>
                    <h4>OCCHIALI</h4>
                    {productsGlass.map(product => (
                    <Link to={`/product/${product._id}`} onClick={onCloseAllBoxes} key={product._id}>{product.nome}</Link>
                ))}
                </Col>
            </Row>
    );
}

export default HeaderProducts;
