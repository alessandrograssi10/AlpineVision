import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderProducts = ({ onCloseAllBoxes }) => {
  const [productsMask, setProductsMask] = useState([]);
  const [productsGlass, setProductsGlass] = useState([]);
  
  // Vengono scaricati i prodotti dal backend
  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Errore');
        }
        return response.json();
      })
      .then(data => {
        // Vengono divisi le maschere dagli occhiali
        const masks = data.filter(product => product.categoria === 'maschera');
        const glasses = data.filter(product => product.categoria === 'occhiale');
        setProductsMask(masks);
        setProductsGlass(glasses);
      })
      .catch(error => console.error('Errore nel recupero dei prodotti', error));
  }, [productsMask]);

  return (
    <Row className="m-5 mt-1 mb-3">
      {/* Maschere */}
      <Col md={2} className="d-flex flex-column">
        <h5 className="bold-text-navbar">MASCHERE</h5>
        {productsMask.map(product => (
          <Link
            className="text-navbar-box"
            to={`/product/${product._id}`}
            onClick={onCloseAllBoxes}
            key={product._id}
          >
            <div className="text-box-prod">{product.nome}</div>
          </Link>
        ))}
      </Col>
      {/* Occhiali */}
      <Col md={2} className="d-flex flex-column">
        <h5 className="bold-text-navbar">OCCHIALI</h5>
        {productsGlass.map(product => (
          <Link
            className="text-navbar-box"
            to={`/product/${product._id}`}
            onClick={onCloseAllBoxes}
            key={product._id}
          >
            <h7 className="text-box-prod">{product.nome}</h7>
          </Link>
        ))}
      </Col>
    </Row>
  );
};

export default HeaderProducts;
