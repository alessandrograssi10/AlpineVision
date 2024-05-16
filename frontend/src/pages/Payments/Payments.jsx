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
import { GetInfo } from '../../assets/Scripts/GetFromCart.js';
import { Link,useNavigate } from 'react-router-dom';
import './Payments.css';

const Payments = () => {
    const { id } = useParams();
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [touchedEmail, setTouchedEmail] = useState(false);
    const [state, setState] = useState({
        nome: '',
        cognome: '',
        nazione: '',
        regione: '',
        città: '',
        email: '',  
        indirizzo: '',
        telefono: '',
        numeroCarta: '',
        scadenza: '',
        cvv: '',
        focused: '',
        touchedScadenza: false,
        productDetails: JSON.parse(localStorage.getItem('productDetails')) || {},
        paymentSuccess: false,
        shippingCost: 0 
    });

    const cartaValida = /^\d{16}$/.test(state.numeroCarta);
    const cvvValido = /^\d{3}$/.test(state.cvv);
    const scadenzaValida = /^(0[1-9]|1[0-2])\/(2[5-9]|[3-9]\d)$/.test(state.scadenza);
    const userId = localStorage.getItem("userId");
    const [cartItems, setCartItems] = useState([]);
    const [cartDetails, setCartDetails] = useState({});
    const [buttonStateDirect, setButtonStateDirect] = useState('default');

    /*useEffect(() => {
        return () => {
            localStorage.removeItem('productDetails');
        };
    }, []);*/
    
    useEffect(() => {
        if (userId) {
            if(id === "cart")
                {
            const requestOptions = {
                method: "GET",
            };
    
            const fetchCartData = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/carts/${userId}`, requestOptions);
                    const result = await response.json();
                    setCartItems(result);
                    console.log("Prodotti", result);
                    
                    const fetchDetails = result.map(item =>
                        GetInfo(item).then(info => ({ _id: info.productId, info }))
                    );
                    console.log("fetchDetails", fetchDetails);
    
                    const detailsArray = await Promise.all(fetchDetails);
                    console.log("detailsArray", detailsArray);

                    const details = detailsArray.reduce((acc, current) => {
                        acc[(current._id)] = current.info;
                        return acc;
                    }, {});
                    console.log("DET", details);
                    setCartDetails(details);
                } catch (error) {
                    console.error('Failed to fetch cart items:', error);
                }
            };
            
            fetchCartData();
            }
        } else {
            var cart = JSON.parse(localStorage.getItem("virtualCart")) || [];
            const fetchCartData = async () => {
                try {
                    const result = cart;
                    setCartItems(result);
                    console.log("Prodotti", result);
                    
                    const fetchDetails = result.map(item =>
                        GetInfo(item).then(info => ({ _id: item.productId + item.color, info }))
                    );
                    console.log("fetchDetails", fetchDetails);
    
                    const detailsArray = await Promise.all(fetchDetails);
                    const details = detailsArray.reduce((acc, current) => {
                        acc[current._id] = current.info;
                        console.log("InfoFunzione", acc);
                        return acc;
                    }, {});
                    setCartDetails(details);
                } catch (error) {
                    console.error('Failed to fetch cart items:', error);
                }
            };
            
            fetchCartData();
            
        }
    }, [userId]);


    async function sendOrder() {
        if (userId) {
            console.log("UserId passato",id)
            let url = '';
            //const array= localStorage.getItem("riepilogoCart");
            const array= localStorage.getItem("productDetails");
            console.log("UserId passato details",array)

            const riepilogoDati = JSON.parse(array);
            console.log("UserId passato details riep",riepilogoDati)

                if (id === 'cart') {
                    const productResponse = await fetch('http://localhost:3000/api/orders/createOrderFromCart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userId": userId,
                            "nome": state.nome,
                            "cognome": state.cognome,
                            "città": state.città,
                            "indirizzo": state.indirizzo,
                            "telefono": state.telefono,
                        })
                    });
                    localStorage.setItem('Cart_Trig', "Trigger");
                } else if (id === 'direct'&&riepilogoDati) {
                    console.log("ProdDetails",riepilogoDati)
                    const productResponse = await fetch(`http://localhost:3000/api/orders/createOrder`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userId": userId,
                            "productId": riepilogoDati.productId,
                            "quantity": riepilogoDati.quantity,
                            "color": riepilogoDati.colore,
                            "type": riepilogoDati.type,
                            "nome": state.nome,
                            "cognome": state.cognome,
                            "città": state.città,
                            "indirizzo": state.indirizzo,
                            "telefono": state.telefono,

                        })
                    });

                    localStorage.setItem("riepilogoCart", JSON.stringify({}));
                    localStorage.setItem('Cart_Trig', "Trigger");
                    localStorage.removeItem('productDetails');

                }
        }
        else{
            console.log("UserId passato",id)
            //const array= localStorage.getItem("riepilogoCart");
            const array= localStorage.getItem("productDetails");
            console.log("UserId passato details",array)

            const riepilogoDati = JSON.parse(array);
            console.log("UserId passato details riep",riepilogoDati)
                if (id === 'cart') {
                    var cart = JSON.parse(localStorage.getItem("virtualCart")) || [];
                    console.log("Cartttttt",cart)
                    const productResponse = await fetch('http://localhost:3000/api/orders/createOrderFromCartGuest', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "nome": state.nome,
                            "cognome": state.cognome,
                            "città": state.città,
                            "indirizzo": state.indirizzo,
                            "telefono": state.telefono,
                            "email": email,
                            "virtualCart": cart,

                        })
                    });
                    localStorage.setItem("virtualCart","[]");
                    localStorage.setItem('Cart_Trig', "Trigger");

                } else if (id === 'direct'&&riepilogoDati) {
                    console.log("ProdDetails",riepilogoDati)
                    const productResponse = await fetch(`http://localhost:3000/api/orders/createOrderGuest`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "productId": riepilogoDati.productId,
                            "quantity": riepilogoDati.quantity,
                            "color": riepilogoDati.colore,
                            "type": riepilogoDati.type,
                            "nome": state.nome,
                            "cognome": state.cognome,
                            "città": state.città,
                            "indirizzo": state.indirizzo,
                            "telefono": state.telefono,
                            "email": email,
                        })
                    });
                    console.log("Email",email)
                    localStorage.setItem("riepilogoCart", JSON.stringify({}));
                    localStorage.setItem('Cart_Trig', "Trigger");
                    localStorage.removeItem('productDetails');

                }
            }
    }
    

    const handleSubmit = (event) => {

        setButtonStateDirect('loading');
            setTimeout(() => {
                setButtonStateDirect('default');
                event.preventDefault();
                 sendOrder();
                navigate(`/confermpay`);
            }, 1500);
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

    const handleChangeEmail = (event) => {
        const { value } = event.target;
        setEmail(value);
    };

    const checkEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const handleCountryChange = (val) => {
        const randomShippingCost = (Math.random() * (30 - 5) + 5).toFixed(2);
    
        setState(prevState => ({
            ...prevState,
            nazione: val,
            regione: '',
            città: '',
            shippingCost: randomShippingCost 
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

    const isFormValid = nome && cognome && nazione && regione && città && indirizzo && numeroCarta && scadenza && cvv&&telefono;
    const isFormVirtualValid= isFormValid && email;

    const totalProductsPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    const total = state.shippingCost + totalProductsPrice;

    return (
        <Container>
            <Row className="justify-content-center align-items-center m-5">
                <Col xs={12} className="d-flex justify-content-between align-items-center">
                    <img src={money} className="money-image1" alt="money" />
                    <h1 className="Payments-title">Pagamento</h1>
                    <img src={money} className="money-image2" alt="money" />
                </Col>
                {!userId&&(
                <Col xs={12} className="d-flex justify-content-center align-items-center m-5">
                    <h3> Nessun account? Nessun problema! Fai shopping e paga in pochi clic.</h3>
                </Col>
                )}
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
                    {!userId && (
                        <Form.Group>
                            <Form.Label className="payments-label">E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Inserisci l'indirizzo email"
                                value={email}
                                onChange={handleChangeEmail}
                                onBlur={() => setTouchedEmail(true)}
                                className={`payments-form ${touchedEmail && !checkEmail(email) ? 'is-invalid' : ''}`}
                            />
                            {touchedEmail && !checkEmail(email) && <div className="invalid-feedback">Inserire un'email valida</div>}
                        </Form.Group>
                    )}
                </Col>
                <Col xs={12} md={6}>
                    <h3 className="text-center m-5">Riepilogo Ordine</h3>
                    {id === 'direct' && (
                        <React.Fragment>
                            <div className="product-details">
                                <img src={state.productDetails.immagine} alt="Prodotto" className="product-image" />
                                <h6>Prodotto: {state.productDetails.nome}, {state.productDetails.colore}</h6>
                                <h6>Prezzo: {state.productDetails.prezzo} €</h6>
                            </div>
                            {/* Calcolo delle spese di spedizione e del totale */}
                            {state.nazione !== '' && (
                                <div className="shipping-details m-5">
                                    <h6>Spese di spedizione da {state.nazione}: {state.shippingCost} €</h6>
                                    <h6>Totale da pagare: {(parseFloat(state.productDetails.prezzo) + parseFloat(state.shippingCost)).toFixed(2)} €</h6>
                                </div>
                            )}
                        </React.Fragment>
                    )}
                    {id === 'cart' && (
                        
                        <React.Fragment>
                            
                            <div className="cart-container">
                                {cartItems?.map((item) => (
                                    <div className="cart-item m-3" key={item.productId}>
                                        <img src={cartDetails[item.productId +item.color ]?.immagine} alt="Prodotto" className="product-image" />
                                        <div className='product-details'>
                                            <h6>{cartDetails[item.productId +item.color ]?.nome}, {cartDetails[item.productId +item.color ]?.colore}</h6>
                                            <h6>Quantità: {cartDetails[item.productId +item.color ]?.quantita}</h6>
                                            <h6>Prezzo: {cartDetails[item.productId +item.color ]?.totale.toFixed(2)} €</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="shipping-details m-5">
                                {state.nazione !== '' && (
                                    <React.Fragment>
                                        <h6>Spese di spedizione da {state.nazione}: {state.shippingCost} €</h6>
                                        <h6>Totale da pagare: {(parseFloat(totalProductsPrice) + parseFloat(state.shippingCost)).toFixed(2)} €</h6>
                                    </React.Fragment>
                                )}
                            </div>
                        </React.Fragment>
                    )}
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
            <Col xs={12} className="d-flex justify-content-center">
                <Row className="m-5 payments-buttons">
                    <Col className="text-center"> {/* Utilizziamo una colonna per allineare i pulsanti */}
                        <Link to="/cart">
                            <Button type="submit" className='button-black-prod-nomon m-3 mt-5'  variant="outline-dark">
                                <h5>Torna al Carrello</h5>
                            </Button>
                        </Link>
                                                    {/*variant="primary" */}
                        <Button className={`button-black-prod m-3 mt-5 ${buttonStateDirect}`}
                            variant="outline-dark"
                            type="submit" 
                            onClick={handleSubmit} 
                            disabled={!isFormValid || !scadenzaValida || (!userId ? !isFormVirtualValid : false)}>
                                {buttonStateDirect === 'loading' && <div className="spinner "></div>}
                                {buttonStateDirect === 'default' && <div className='p-0 m-0'><h3 className='p-0 m-0'>CONFERMA PAGAMENTO</h3></div>}
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Container>
    );
};

export default Payments;
