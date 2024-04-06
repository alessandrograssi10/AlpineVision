import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EmptyBag from '../../assets/Images/empty-bag.png';

export const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    const removeFromCart = (item) => {
        const updatedCartItems = cartItems.filter((cartItem) => cartItem !== item);
        setCartItems(updatedCartItems);
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col>
                    {cartItems.length === 0 ? (
                        <Row className="justify-content-center">
                            <Col>
                                <h1 className="text-center">
                                    <img src={EmptyBag} alt="Empty Bag" />CARRELLO{' '}
                                    <img src={EmptyBag} alt="Empty Bag" />
                                </h1>
                            </Col>
                        </Row>
                    ) : (
                        <ul>
                            {cartItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    )}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className='text-center'>
                    <Button onClick={() => null}>SIGN IN</Button>
                </Col>
                <Col className="text-center">
                    <Button onClick={() => null}>SHOP MASKS</Button>
                </Col>
                <Col className="text-center">
                    <Button onClick={() => null}>SHOP ACCESSORIES</Button>
                </Col>
            </Row>
            {cartItems.length > 0 && (
                <Row className="justify-content-center">
                    <Col>
                        <Button variant="danger" onClick={() => setCartItems([])}>
                            Clear Cart
                        </Button>
                    </Col>
                </Row>
            )}
        </Container>
    );
};
