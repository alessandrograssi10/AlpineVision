import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CartCard from './CartCard.jsx';


function Cart() {

    const [cartItems, setCartItems] = useState([]);
    const [prov, setProv] = useState(0);
    const userId = localStorage.getItem('userId'); 

    let totalPrice;

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
                setCartItems(result);
                totalPrice = result.reduce((somma, cartItem) => somma + cartItem.total, 0);
                setProv(totalPrice);
            })
            .catch((error) => console.error(error));

    }, []);

    const updateTotalPrice = (priceToAdd,incDec) => {
        let newTotalPrice;
        if(incDec == true){
            newTotalPrice = prov + priceToAdd;
        } else {
            newTotalPrice = prov - priceToAdd;
        }
        
        setProv(newTotalPrice);
    }

    console.log("Prezzo totale:", prov);

    return (
        <Container className="mb-5">
            <Row className="mt-3 mb-5 bg-light">
                <h1 className="fw-bold">Il tuo carrello</h1>
            </Row>
            
            {cartItems.map((cartItem) => (
                <CartCard
                price={cartItem.total}
                quantity={cartItem.quantity}
                updateTotalPrice={updateTotalPrice}>
                </CartCard>
            ))}

            <Row className="p-2 mt-5">
                {/* Procedi all'acquisto */}
                <Col className="d-flex justify-content-end">
                    <Button id="buyButton" className="fs-4">
                        Procedi all'acquisto
                    </Button>
                </Col>
                {/* Totale */}
                <Col className="fw-bold fs-5 d-flex align-items-center justify-content-start">   
                    Totale: {prov}
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;
