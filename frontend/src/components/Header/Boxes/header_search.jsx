import React, { useState} from 'react';
import { Row, Form } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';

export const HeaderSearch = ({ onCloseAllBoxes }) => {
    const [searchTerm, setSearchTerm] = useState(''); // Stringa cerca
    let navigate = useNavigate(); // Metodo per navigare tra le pagine

    // Funzione che viene chiamate ad un cambiamento di search
    const handleSearchChange = (event) => { 
        event.preventDefault();
        event.stopPropagation();
        const Query = event.target.value; 
        setSearchTerm(Query);
        if (!Query || Query.trim() === '') return; // Se è vuota non fa accadere nulla
    }; 

    // Avvia la ricerca quando si preme invio
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (!searchTerm) return;
            event.preventDefault();
            event.stopPropagation();
            const url = '/search?' + encodeURIComponent(searchTerm).toString();
            onCloseAllBoxes(); // Chiude la tendina della navbar
            navigate(url); 
        }
    };

    return (
        <Row className='m-5 mt-0 mb-3'>

            {/* Barra di ricerca */}

            <Form  onSubmit={handleSearchChange} action = {`http://localhost:3020/search?` + searchTerm} className="mt-2 mb-2">
                <Form.Control
                    type="text"
                    placeholder="Che cosa stai cercando?"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onSubmit={handleSearchChange}
                    onKeyDown={handleKeyPress} 
                    />
            </Form>

            {/* Suggerimenti */}
            
            <Row>
                <p className='m-3 mt-2 mb-2 text-search-find'>Collegamenti Rapidi</p>
                <Link className="text-navbar-box" to={`/products/`} onClick={onCloseAllBoxes}>
                    <h7 className='text-box-prod'> - Prodotti</h7>
                </Link>
                <Link className="text-navbar-box" to={`/accessories/`} onClick={onCloseAllBoxes}>
                    <h7 className='text-box-prod'> - Accessori</h7>
                </Link>
                <Link className="text-navbar-box" to={`/blog/`} onClick={onCloseAllBoxes}>
                    <h7 className='text-box-prod'> - Blog</h7>
                </Link>
            </Row>
        </Row>
    );
}

export default HeaderSearch;
