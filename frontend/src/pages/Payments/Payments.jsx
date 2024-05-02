import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const Payments = () => {
  
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
        // Implement the submission logic here, possibly sending data to a backend server
        alert('Informazioni inviate!');
      };
    
      // Basic validations
      const isValid = () => {
        const { nome, cognome, indirizzo, cap, citta, regione, nazione, telefono } = state;
        const phoneRegex = /^[0-9]+$/; // Simple validation for demonstration
        const capRegex = /^[0-9]{5}$/;
        return nome.length > 0 &&
               cognome.length > 0 &&
               indirizzo.length > 0 &&
               capRegex.test(cap) &&
               citta.length > 0 &&
               regione.length > 0 &&
               nazione.length > 0 &&
               phoneRegex.test(telefono);
      };
      const handleChange = (event) => {
        const { name, value } = event.target;
        let newState = { ...state, [name]: value };
    
        if (name === 'numeroCarta') {
          newState.tipoCarta = detectCardType(value);
        }
    
        setState(newState);
      };
    
      const detectCardType = (number) => {
        const cleanNumber = number.replace(/\D/g, '');
        if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanNumber)) {
          return 'Visa';
        } else if (/^5[1-5][0-9]{14}$/.test(cleanNumber)) {
          return 'Mastercard';
        }
        return '';
      };
    
      const isValidCardNumber = (number) => {
        const cleanNumber = number.replace(/\D/g, '');
        let nCheck = 0, bEven = false;
    
        for (var n = cleanNumber.length - 1; n >= 0; n--) {
          var cDigit = cleanNumber.charAt(n),
              nDigit = parseInt(cDigit, 10);
    
          if (bEven && (nDigit *= 2) > 9) nDigit -= 9;
    
          nCheck += nDigit;
          bEven = !bEven;
        }
    
        return (nCheck % 10) === 0;
      };
    
      return (
        <Container>
           <Row className=" d-flex align-items-center  m-5 ">
            <h1 className=" ">Checkout</h1>

            </Row>
          <Row className="justify-content-md-left m-5">
            
            
            <Col xs={12} md={6}>
            <h3 className="d-flex justify-content-center m-5" >Inserisci le informazioni di consegna</h3>

                  <Form onSubmit={handleSubmit}>
                   
                        <Form.Group controlId="formNome"className='m-2'>
                          <Form.Label>Nome</Form.Label>
                          <Form.Control
                            type="text"
                            name="nome"
                            value={state.nome}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      
                        <Form.Group controlId="formCognome"className='m-2'>
                          <Form.Label>Cognome</Form.Label>
                          <Form.Control
                            type="text"
                            name="cognome"
                            value={state.cognome}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      
    
                    <Form.Group controlId="formIndirizzo"className='m-2'>
                      <Form.Label>Indirizzo</Form.Label>
                      <Form.Control
                        type="text"
                        name="indirizzo"
                        value={state.indirizzo}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
    
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId="formCap"className='m-2'>
                          <Form.Label>CAP</Form.Label>
                          <Form.Control
                            type="text"
                            name="cap"
                            value={state.cap}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="formCitta"className='m-2'>
                          <Form.Label>Città</Form.Label>
                          <Form.Control
                            type="text"
                            name="citta"
                            value={state.citta}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="formRegione"className='m-2'>
                          <Form.Label>Regione</Form.Label>
                          <Form.Control
                            type="text"
                            name="regione"
                            value={state.regione}
                            onChange={handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
    
                    <Form.Group controlId="formNazione"className='m-2'>
                      <Form.Label>Nazione</Form.Label>
                      <Form.Control
                        type="text"
                        name="nazione"
                        value={state.nazione}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <h3 className="d-flex justify-content-center m-5" >Inserisci le informazioni di contatto</h3>

                    <Form.Group controlId="formTelefono" className='m-2'>
                      <Form.Label>Numero di telefono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={state.telefono}
                        onChange={handleChange}
                        pattern="[0-9]+"
                        title="Il numero di telefono deve contenere solo numeri."
                        required
                      />
                    </Form.Group>
                    <h3 className="d-flex justify-content-center m-5" >Inserisci i dati della tua carta</h3>

                    <Form.Group controlId="formNumeroCarta"className='m-2'>
                  <Form.Label>Numero della Carta</Form.Label>
                  <Form.Control
                    type="text"
                    name="numeroCarta"
                    placeholder="Inserisci il numero della carta"
                    value={state.numeroCarta}
                    onChange={handleChange}
                    required
                  />
                  {state.tipoCarta && <Form.Text>{state.tipoCarta}</Form.Text>}
                </Form.Group>

                <Form.Group controlId="formScadenzaCarta"className='m-2'>
                  <Form.Label>Data di Scadenza</Form.Label>
                  <Form.Control
                    type="text"
                    name="scadenzaCarta"
                    placeholder="MM/YY"
                    value={state.scadenzaCarta}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCVV"className='m-2'>
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={state.cvv}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                    
                  </Form>
                
            </Col>
            <Col xs={12} md={6}>
            <h3 className="d-flex justify-content-center m-5" >Riepilogo ordine</h3>

            </Col>
          </Row>
          <Row className="justify-content-md-center m-5">
            <Col md={2} className="d-flex justify-content-center">
          <Button variant="primary" type="submit" disabled={!isValid()}>
                      <h5>Termina e paga</h5>
                    </Button>
                    </Col>
          </Row>
        </Container>
      );
    };

