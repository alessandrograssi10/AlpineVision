import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderAccessories = ({ onCloseAllBoxes }) => {


    const [productAccessories, setProductsAccessories] = useState();
    const [imgMask, setImgMask] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask
    const [imgGlass, setImgGlass] = useState(''); // Dichiarazione dello stato imgMask e della funzione setImgMask

    useEffect(() => {
        fetch(`http://localhost:3000/api/accessories`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            //const imgMaskValue = `http://localhost:3000/api/products/${masks[0]?._id}/verde/frontale`;
            //const imgGlassValue = `http://localhost:3000/api/products/${glasses[0]?._id}/verde/frontale`;
            console.log(data,"HHHHHH");
            setProductsAccessories(data);
          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));
      }, []);
      
  
        return (
            <Row className='m-5 mt-1 mb-3'>
                <Col md={2} className="d-flex flex-column">
                {/*<Image key={productsMask} src={imgMask} style={{ width: '115px', height: '115px' }}/>*/}

                    <h6 className='bold-text-navbar'>ACCESSORI</h6>
                    {productAccessories?.map(product => (
                    <Link className='text-navbar-box' to={`/accessory/${product._id}`} onClick={onCloseAllBoxes} key={product._id}><div className='text-navbar-box'>{product.name}</div></Link>
                ))}
                </Col>
                
            </Row>
    );
}

export default HeaderAccessories;
