import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderAccessories = ({ onCloseAllBoxes }) => {
    const [productAccessories, setProductsAccessories] = useState();

    // Prendo le informazioni dal backend e le salvo in productAccessories
    useEffect(() => {
        fetch(`http://localhost:3000/api/accessories`)
          .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
          .then(data => {
            setProductsAccessories(data);
          })
          .catch(error => console.error("Errore nel recupero dei prodotti", error));
    }, [productAccessories]);
      
    return (
        <Row className='m-5 mt-1 mb-3'>
            <Col md={2} className="d-flex flex-column">
                <h5 className='bold-text-navbar'>ACCESSORI</h5>

                {/* Visualizzazioni in link dei prodotti */}

                {productAccessories?.map(product => (
                    <Link className='text-navbar-box' to={`/accessory/${product._id}`} onClick={onCloseAllBoxes} key={product._id}><div className="text-box-prod">{product.name}</div></Link>
                ))}
            </Col>
        </Row>
    );
}

export default HeaderAccessories;
