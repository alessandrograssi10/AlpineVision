import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CartCard from './CartCard.jsx';
import { Link } from 'react-router-dom';
import './Cart.css';
import cartimage from '../../assets/Images/cartimage.png';

function Cart() {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [toggler, setToggler] = useState(false);

    const userID = localStorage.getItem('userId');

    //  Scarica carrello
    useEffect(() => {
        if(userID){
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch(`http://localhost:3000/api/carts/${userID}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setCartItems(result);
                const provTotalPrice = result.reduce((somma, cartItem) => somma + cartItem.total, 0);
                setTotalPrice(provTotalPrice);
                setToggler(result.length !== 0);
            })
            .catch((error) => console.error(error));
        }
        else{
            var cart = JSON.parse(localStorage.getItem("virtualCart")) || [];
            setCartItems(cart);
            //
            let provTotalPrice = 0;
            if (Array.isArray(cart)) {
                provTotalPrice = cart.reduce((total, cartItem) => total + cartItem.total, 0);
            } 
            setTotalPrice(provTotalPrice);
            setToggler(cart.length !== 0);
        }
    }, []);

    //  Aggiorna pulsante carrello
    useEffect(() => {
        if (cartItems.length == 0) {
            if(userID) setTotalPrice(0); //se attivo rompe tutto
            console.log("Zero")
            setToggler(false);
        } else if (cartItems.length > 0) {
            setToggler(true);
        }
    }, [cartItems]);

    //  Aggiorna prezzo totale al cambiamento delle quantità
    const updateTotalPrice = (priceToAdd, incDec) => {
        let newTotalPrice;
        if (incDec === true) {
            newTotalPrice = totalPrice + priceToAdd;
        } else {
            newTotalPrice = totalPrice - priceToAdd;
        }
        setTotalPrice(newTotalPrice);
    }

    //  Rimuove un prodotto dal db
    const removeProd = (delProductId, priceToDel,colore) => {
        const newCartItems = cartItems.filter(product => product.productId !== delProductId);
        setCartItems(newCartItems);
        const newPrice = totalPrice - priceToDel;
        setTotalPrice(newPrice);

        if(userID){
        const myHeadersrm = new Headers();
        myHeadersrm.append("Content-Type", "application/json");

        const rawrm = JSON.stringify({
            "userId": `${userID}`,
            "productId": `${delProductId}`,
            "color": `${colore}`,
        });

        const requestOptionsrm = {
            method: "DELETE",
            headers: myHeadersrm,
            body: rawrm,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/carts/remove", requestOptionsrm)
            .then((response) => response.text())
            .then((result) => localStorage.setItem('Cart_Trig', "Trigger"))
            .catch((error) => console.error(error));
    }
        localStorage.setItem('Cart_Trig', "Trigger");

    }

    const handleCheckout = () => {
        localStorage.setItem('totalPrice', totalPrice.toFixed(2));
    }

    console.log(cartItems);

    return (
        <Container className="mb-5">
            <Row className="mt-5 mb-5">
                <Col className="d-flex align-items-center">
                    <h1 className="fw-bold">IL TUO CARRELLO</h1>
                    <img id="cartimage" src={cartimage} alt="cartimage" />
                </Col>
            </Row>

            {(cartItems.length === 0) ?
                (<Row className="">
                    <h1> Carrello vuoto </h1>
                </Row>
                ) : (
                    cartItems.map((cartItem) => (
                        <CartCard
                            key={cartItem.productId}
                            quantity={cartItem.quantity}
                            updateTotalPrice={updateTotalPrice}
                            prodID={cartItem.productId}
                            color={cartItem.color}
                            type={cartItem.type}
                            removeProd={removeProd}

                        />
                    ))
                )}
            <Row className="p-2 mt-3 justify-content-between align-items-end">
                <Col className="d-flex justify-content-start">
                    {(toggler) ? (
                        <Row className="w-100">
                            <Col xs="6">
                                <Link to="/Payments/cart" className="fs-4">
                                    <Button id="buyButton" onClick={handleCheckout}>
                                        Procedi all'acquisto
                                    </Button>
                                </Link>
                            </Col>
                            <Col xs="6" className="d-flex align-items-center justify-content-end">
                                <h3 className="fw-bold fs-3">Totale: {!isNaN(totalPrice) ? totalPrice.toFixed(2) + ' €' : '0€'}</h3>
                            </Col>
                        </Row>
                    ) : (
                        <Link to="/Products" className="invisible-link">
                            <Button id="prodPageButton" className="fs-4">
                                Shop
                            </Button>
                        </Link>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;
