import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
            <Row className='m-5 mt-1 mb-3'>
                <Col md={2} className="d-flex flex-column">
                {/*<Image key={productsMask} src={imgMask} style={{ width: '115px', height: '115px' }}/>*/}

                    <h6 className='bold-text-navbar'>MASCHERE</h6>
                    {productsMask.map(product => (
                    <Link className='text-navbar-box' to={`/product/${product._id}`} onClick={onCloseAllBoxes} key={product._id}><div className='text-navbar-box'>{product.nome}</div></Link>
                ))}
                </Col>
                <Col md={2} className="d-flex flex-column">
                {/*<Image key={productsMask} src={imgGlass} style={{ width: '115px', height: '115px' }}/>/>*/}
                    <h6 className='bold-text-navbar'>OCCHIALI</h6>
                    {productsGlass.map(product => (
                    <Link className='text-navbar-box' to={`/product/${product._id}`} onClick={onCloseAllBoxes} key={product._id}><h7>{product.nome}</h7></Link>
                ))}
                </Col>
            </Row>
    );
}

export default HeaderProducts;
