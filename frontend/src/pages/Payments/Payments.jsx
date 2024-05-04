import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Cards from 'react-credit-cards-2';

import money from '../../assets/Images/money.png';
import './Payments.css';

const Payments = () => {
    const [state, setState] = useState({
        nome: '',
        cognome: '',
        nazione: '',
        regione: '',
        città: '',
        indirizzo: '',
        telefono: '',
        numeroCarta: '',
        scadenza: '',
        cvv: '',
        focused: ''
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const cartaValida = /^\d{16}$/.test(state.numeroCarta);
        const cvvValido = /^\d{3}$/.test(state.cvv);
        const scadenzaValida = /^(0[1-9]|1[0-2])\/(2[5-9]|[3-9]\d)$/.test(state.scadenza); // Verifica la scadenza tra 01/25 e 12/99
        const telefonoValido = /^\+\d{2}\s\d{3}\s\d{3}\s\d{4}$/.test(state.telefono); // Verifica il formato del numero di telefono
        
        if (!telefonoValido) {
            return;
        }
        if (!cartaValida || !cvvValido || !scadenzaValida) {
            return;
        }
        alert('Informazioni inviate!');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: name === 'numeroCarta' ? value.replace(/\D/g, '').slice(0, 16) :
                name === 'cvv' ? value.replace(/\D/g, '').slice(0, 3) :
                name === 'scadenza' ? value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2') :
                value
        }));
    };

    const handleChangePhoneNumber = (val) => {
        if (/^\+\d{2}\s\d{3}\s\d{3}\s\d{4}$/.test(val) || val === '') {
            setState(prevState => ({ ...prevState, telefono: val }));
        }
    };

    const handleCountryChange = (val) => {
        setState(prevState => ({
            ...prevState,
            nazione: val,
            regione: '',
            città: ''
        }));
    };

    const handleRegionChange = (val) => {
        setState(prevState => ({
            ...prevState,
            regione: val,
            città: ''
        }));
    };

    const handleCVVFocus = () => {
        setState(prevState => ({
            ...prevState,
            focused: 'cvc'
        }));
    };

    const handleCVVBlur = () => {
        setState(prevState => ({
            ...prevState,
            focused: ''
        }));
    };

    const { nome, cognome, nazione, regione, città, indirizzo, telefono, numeroCarta, scadenza, cvv, focused } = state;

    return (
        <Container>
            <Row className="justify-content-center align-items-center m-5">
                <Col xs={12} className="d-flex justify-content-between align-items-center">
                    <img src={money} className="money-image1" alt="money" />
                    <h1 className="Payments-title">Pagamento</h1>
                    <img src={money} className="money-image2" alt="money" />
                </Col>
            </Row>
            <Row className="justify-content-md-center m-2">
                {/* Colonna INFO DI CONSEGNA */}
                <Col xs={12} md={6}>
                    <h3 className="text-center m-5">Informazioni di consegna</h3>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Nome</Form.Label>
                                <Form.Control type="text" name="nome" value={nome} onChange={handleChange} className="payments-form" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Cognome</Form.Label>
                                <Form.Control type="text" name="cognome" value={cognome} onChange={handleChange} className="payments-form" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Nazione</Form.Label>
                                <CountryDropdown
                                    defaultOptionLabel='Seleziona Nazione'
                                    value={nazione}
                                    onChange={(val) => handleCountryChange(val)}
                                    className="payments-form"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Regione</Form.Label>
                                <RegionDropdown
                                    defaultOptionLabel='Seleziona Regione'
                                    country={nazione}
                                    value={regione}
                                    onChange={(val) => handleRegionChange(val)}
                                    className="payments-form"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Città</Form.Label>
                                <Form.Control type="text" name="città" value={città} onChange={handleChange} className="payments-form" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Indirizzo</Form.Label>
                                <Form.Control type="text" name="indirizzo" value={indirizzo} onChange={handleChange} className="payments-form" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label className="payments-label">Telefono</Form.Label>
                        <PhoneInput
                            placeholder="Inserisci il numero di telefono"
                            value={telefono}
                            onChange={handleChangePhoneNumber}
                            className="payments-form"
                        />
                    </Form.Group>
                </Col>

                {/* Colonna RIEPILOGO ORDINE */}
                <Col xs={12} md={6}>
                    <h3 className="text-center m-5">Riepilogo ordine</h3>
                    {/* Contenuto del riepilogo ordine */}
                </Col>
            </Row>

            <Row className="justify-content-md-center m-2">
                {/* Colonna INFO DI PAGAMENTO */}
                <Col xs={12} md={6} >
                    <h3 className="text-center m-5">Informazioni di pagamento</h3>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">Numero Carta</Form.Label>
                                <Form.Control type="text" name="numeroCarta" value={numeroCarta} onChange={handleChange} className="payments-form" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label className="payments-label">CVV</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="cvv" 
                                    value={cvv} 
                                    onChange={handleChange} 
                                    onFocus={handleCVVFocus} 
                                    onBlur={handleCVVBlur} 
                                    className="payments-form" 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label className="payments-label">Data di Scadenza</Form.Label>
                        <Form.Control type="text" name="scadenza" placeholder="MM/YY" value={scadenza} onChange={handleChange} className="payments-form" />
                    </Form.Group>

                </Col>
                {/* Colonna CON CARD */}
                <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                     <div className="enlarged-card">
                    <Cards
                     number={numeroCarta}
                     name={nome + ' ' + cognome}
                     expiry={scadenza}
                     cvc={cvv}
                     focused={focused} 
                     />
                     </div>
                </Col>
            </Row>
             <Row className=" justify-content-center m-5">
                <Button variant="primary" type="submit" className="payment-button " onClick={handleSubmit}>
                            <h5>Completa Ordine</h5>
                        </Button>
                    </Row>
        </Container>
    );
};

export default Payments;
