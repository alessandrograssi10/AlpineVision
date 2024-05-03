import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CartCard from './CartCard.jsx';
import shoppingCart from '../../assets/Images/shopping-cart.png';
import './Cart.css';

function Cart() {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userId = localStorage.getItem('userId');

    let provTotalPrice;

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(`http://localhost:3000/api/carts/${userId}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                setCartItems(result);
                provTotalPrice = result.reduce((somma, cartItem) => somma + cartItem.total, 0);
                setTotalPrice(provTotalPrice);
            })
            .catch((error) => console.error(error));

    }, []);

    const updateTotalPrice = (priceToAdd, incDec) => {
        let newTotalPrice;
        if (incDec == true) {
            newTotalPrice = totalPrice + priceToAdd;
        } else {
            newTotalPrice = totalPrice - priceToAdd;
        }

        setTotalPrice(newTotalPrice);

    }

    useEffect(() => {
        console.log(totalPrice);
    }, [totalPrice])

    const removeProd = (variantId) => {

    }

    return (
        <Container className="mb-5">
            <Row className="mt-3 mb-5 bg-light">
                <Col xs="1" className="d-flex align-items-center me-2">
                    <div id="cartImgDiv">
                        <img src={shoppingCart} alt="" />
                    </div>
                </Col>
                <Col className="">
                    <h1 className="fw-bold  ">Il tuo carrello</h1>
                </Col>



            </Row>

            {(cartItems.length == null) ?

                (<Row className="">
                    <h1> Carrello vuoto </h1>
                </Row>

                )
                :
                (cartItems.map((cartItem) => (
                    <CartCard
                        price={cartItem.total}
                        quantity={cartItem.quantity}
                        updateTotalPrice={updateTotalPrice}
                        prodID={cartItem.productId}>
                    </CartCard>
                ))
                )

            }

            <Row className="p-2 mt-5">
                {/* Procedi all'acquisto */}
                <Col className="d-flex justify-content-end">
                    {((cartItems.length == null) ?
                        <Button id="prodPageButton" className="fs-4">
                            Vai alla nostra pagina prodotti!
                        </Button>
                        :
                        <Button id="buyButton" className="fs-4">
                            Procedi all'acquisto
                        </Button>)
                    }

                </Col>
                {/* Totale */}
                <Col className="fw-bold fs-5 d-flex align-items-center justify-content-start">
                    Totale: {totalPrice.toFixed(2)} €
                </Col>
            </Row>
        </Container >
    );
}

export default Cart;
