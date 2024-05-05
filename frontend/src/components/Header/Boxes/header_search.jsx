import React, { useState} from 'react';
import { Row, Form,Button } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';

export const HeaderSearch = ({ onCloseAllBoxes }) => {
    const [searchTerm, setSearchTerm] = useState(''); //da eliminare
    let navigate = useNavigate();

    const handleSearchChange = (event) => { 
        event.preventDefault();
        event.stopPropagation();
       const Query = event.target.value; 
       setSearchTerm(Query);
       if (!Query || Query.trim() === '') return;
    }; 
    const handleSearchChangeclick = (event) => { 
        const url = '/search?' + encodeURIComponent(searchTerm).toString();
        onCloseAllBoxes();
        navigate(url); // Use encodeURIComponent to handle special characters in URL
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (!searchTerm) return;
            event.preventDefault();
            event.stopPropagation();
            handleSearchChangeclick(); // Chiama la funzione per gestire la ricerca
            onCloseAllBoxes();
        }
    };

        return (
            <Row className='m-5 mt-0 mb-3'>
                <Form  onSubmit={handleSearchChange} action = {`http://localhost:3020/search?` + searchTerm} className="mt-2 mb-2">
                    <Form.Control
                        type="text"
                        placeholder="Che cosa stai cercando?"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onSubmit={handleSearchChange}
                        onKeyDown={handleKeyPress} 
                        />
                     {/*<Button variant="primary" onClick ={handleSearchChangeclick}type="submit">Invia</Button>*/}
                </Form>
                <Row>
                <p className='m-3 mt-2 mb-2 text-search-find'>Collegamenti Rapidi</p>
                <Link className="text-navbar-box" to={`/products/`} onClick={onCloseAllBoxes}>
                    <h7> - Prodotti</h7>
                </Link>
                <Link className="text-navbar-box" to={`/accessories/`} onClick={onCloseAllBoxes}>
                    <h7> - Accessori</h7>
                </Link>
                <Link className="text-navbar-box" to={`/blog/`} onClick={onCloseAllBoxes}>
                    <h7> - Blog</h7>
                </Link>
                </Row>
            </Row>
            
    );
}

export default HeaderSearch;
