import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useParams } from 'react-router-dom';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Cards from 'react-credit-cards-2';
import money from '../../assets/Images/money.png';
import './Payments.css';

const Payments = () => {
    const { id } = useParams();
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
        focused: '',
        touchedScadenza: false,
        productDetails: JSON.parse(localStorage.getItem('productDetails')) || {},
        paymentSuccess: false
       
    });

    const cartaValida = /^\d{16}$/.test(state.numeroCarta);
    const cvvValido = /^\d{3}$/.test(state.cvv);
    const scadenzaValida = /^(0[1-9]|1[0-2])\/(2[5-9]|[3-9]\d)$/.test(state.scadenza);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        console.log(id);
    }, []);

   
    async function sendOrder() {
        if (userId) {
            let url = '';
            const arra = localStorage.getItem("riepilogoCart");
            const riepilogoDati = JSON.parse(arra);
            if(id === 'cart')
            {
                    url = 'http://localhost:3000/api/orders/createOrderFromCart';
                    try {
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: userId,
                            })
                        });
                        console.log("Ordine", "comp")
                        localStorage.setItem('Cart_Trig',"Trigger");
        
                    } catch (error) { console.error('Error:', error); }
            }
            if(id === 'direct')
                {
                        url = 'http://localhost:3000/api/orders/createOrder';
                        try {
                            const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    productId: riepilogoDati.productId,
                                    quantity: riepilogoDati.quantity,
                                    color: riepilogoDati.color,
                                    type: riepilogoDati.type,
                                })
                            });
                            console.log("Ordine", "comp")
                            localStorage.setItem('Cart_Trig',"Trigger");
            
                        } catch (error) { console.error('Error:', error); }
                }
            
        } 
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.removeItem('productDetails');
        sendOrder();
        console.log('Pagamento effettuato con successo');
    };
    

    const handleChange = (event) => {
        const { name, value } = event.target;
        let formattedValue = value;
        if (name === 'nome' || name === 'cognome' || name === 'città' || name === 'indirizzo') {
            formattedValue = value.replace(/\d/g, '');
        } 
        else if (name === 'numeroCarta') {
            formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        } else if (name === 'scadenza') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2');
        }
        setState(prevState => ({
            ...prevState,
            [name]: formattedValue
        }));
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
    const handleChangePhoneNumber = (val) => {
        setState(prevState => ({ ...prevState, telefono: val }));
    };

    const { nome, cognome, nazione, regione, città, indirizzo, telefono, numeroCarta, scadenza, cvv, focused, touchedScadenza } = state;

    const isFormValid = nome && cognome && nazione && regione && città && indirizzo && numeroCarta && scadenza && cvv;

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
                            maxLength={12}
                            onChange={handleChangePhoneNumber}
                            className="payments-form"
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={6}>
    <h3 className="text-center m-5">Riepilogo ordine</h3>
    <div className="product-details">
        <img src={state.productDetails.immagine} alt="Prodotto" className="product-image-direct" />
            <h6>Prodotto: {state.productDetails.nome}, {state.productDetails.colore}</h6>
            <h6>Prezzo: {state.productDetails.prezzo} €</h6>
    </div>
</Col>


            </Row>

            <Row className="justify-content-md-center m-2">
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
                        <Form.Control 
                            type="text" 
                            name="scadenza" 
                            placeholder="MM/YY" 
                            value={scadenza} 
                            onChange={handleChange} 
                            onBlur={() => setState(prevState => ({ ...prevState, touchedScadenza: true }))} 
                            className={`payments-form ${touchedScadenza && !scadenzaValida ? 'is-invalid' : ''}`} 
                        />
                        {touchedScadenza && !scadenzaValida && <div className="invalid-feedback">Inserire scadenza valida</div>}
                    </Form.Group>
                </Col>
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
                <Button variant="primary" type="submit" className="payment-button" onClick={handleSubmit} disabled={!isFormValid || !scadenzaValida}>
                    <h5>Conferma Pagamento</h5>
                </Button>
            </Row>
        </Container>
    );
};

export default Payments;
