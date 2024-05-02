import React, { useState, useEffect } from 'react';
import { Row, Form,Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const HeaderSearch = ({ onCloseAllBoxes }) => {
    const [searchTerm, setSearchTerm] = useState(''); //da eliminare

    const handleSearchChange = (event) => { setSearchTerm(event.target.value); }; 


        return (
            <Row>
                <Form className="mt-5 mb-5">
                    <Form.Control
                        type="text"
                        placeholder="Cerca..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Form>
            </Row>
    );
}

export default HeaderSearch;
