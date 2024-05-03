// payments.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import money from '../../assets/Images/money.png';
import './Payments.css';

const Payments = () => {
    const [state, setState] = useState({
        nome: '',
        cognome: '',
        indirizzo: '',
        cap: '',
        citta: '',
        regione: '',
        nazione: '',
        telefono: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Informazioni inviate!');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
      
        <Container>
           
            <Row className="justify-content-center align-items-center m-5">
              <Col xs={12} className="text-center">
              <img src={money} className="money-image1" alt="money" />
            <img src={money} className="money-image2" alt="money" />

                 <h1>Pagamento</h1>
                 
                 </Col>
                 </Row>
                 
            <Row className="justify-content-md-left m-5">
                <Col xs={12} md={6}>
                    <h3 className="text-center m-5">Inserisci le informazioni di consegna</h3>
                    <Form onSubmit={handleSubmit}>
                        {/* Campi del form */}
                    </Form>
                </Col>
                <Col xs={12} md={6}>
                    <h3 className="text-center m-5">Riepilogo ordine</h3>
                    {/* Contenuto del riepilogo ordine */}
                </Col>
            </Row>
            <Row className="justify-content-md-center m-5">
                <Col md={2} className="d-flex justify-content-center">
                    <Button variant="primary" type="submit">
                        <h5>Termina e paga</h5>
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Payments;
