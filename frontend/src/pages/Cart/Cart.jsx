import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CartCard from './CartCard.jsx';
import shoppingCart from '../../assets/Images/shopping-cart.png';
import './Cart.css';

function Cart() {

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [toggler, setToggler] = useState(false);
    const userID = localStorage.getItem('userId');


    useEffect(() => {
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
                const provTotalPrice = result.reduce((somma, cartItem) => somma + cartItem.total * cartItem.quantity, 0);
                setTotalPrice(provTotalPrice);
                if (cartItems.length == 0) {
                    setToggler(false);
                } else if (cartItems.length != 0) {
                    setToggler(true);
                }
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

    const removeProd = (delProductId) => {
        const newCartItems = cartItems.filter(product => product.productId !== delProductId);
        setCartItems(newCartItems);

        const myHeadersrm = new Headers();
        myHeadersrm.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "userId": `${userID}`,
            "productId": `${delProductId}`
        });

        const requestOptions = {
            method: "DELETE",
            headers: myHeadersrm,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/carts/remove", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log())
            .catch((error) => console.error(error));

        
    }


    useEffect(() => {
        if (cartItems.length == 0) {
            setTotalPrice(0);
            setToggler(false);
        } else if (cartItems.length > 0) {
            setToggler(true);
        }
    }, [cartItems]);

    console.log(toggler);

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
                        prodID={cartItem.productId}
                        color={cartItem.color}
                        type={cartItem.type}
                        removeProd={removeProd}>
                    </CartCard>
                ))
                )

            }

            <Row className="p-2 mt-5">
                {/* Procedi all'acquisto */}
                <Col className="d-flex justify-content-end">
                    {((toggler) ?
                        <Button id="buyButton" className="fs-4">
                            Procedi all'acquisto
                        </Button>
                        :
                        <Button id="prodPageButton" className="fs-4">
                            Shop
                        </Button>
                    )
                    }

                </Col>
                {/* Totale */}
                <Col className="fw-bold fs-5 d-flex align-items-center justify-content-start">
                    Totale: {totalPrice.toFixed(2)}€
                </Col>
            </Row>
        </Container >
    );
}

export default Cart;
