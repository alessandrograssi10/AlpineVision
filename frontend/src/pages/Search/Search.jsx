import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';



export const Search = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        // Qui potresti aggiungere logica per effettuare una chiamata API o per filtrare i dati
        console.log('Ricerca per:', query);
    };

    return (
        <div className="container mt-5">
            <Form onSubmit={handleSearch}>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Cerca..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                        Cerca
                    </Button>
                </InputGroup>
            </Form>
        </div>
    );
}