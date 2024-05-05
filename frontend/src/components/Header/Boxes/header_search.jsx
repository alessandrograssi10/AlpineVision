import React, { useState} from 'react';
import { Row, Form,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
            event.preventDefault();
            event.stopPropagation();
            handleSearchChangeclick(); // Chiama la funzione per gestire la ricerca
            onCloseAllBoxes();
        }
    };

        return (
            <Row>
                <Form  onSubmit={handleSearchChange} action = {`http://localhost:3020/search?` + searchTerm} className="mt-5 mb-5">
                    <Form.Control
                        type="text"
                        placeholder="Cerca..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onSubmit={handleSearchChange}
                        onKeyDown={handleKeyPress} 
                        />
                     <Button variant="primary" onClick ={handleSearchChangeclick}type="submit">Invia</Button>
                </Form>
            </Row>
    );
}

export default HeaderSearch;
