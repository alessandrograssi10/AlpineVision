import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import './CartCard.css'
import trashBin from '../../assets/Images/trashBin.png'

function CartCard({ price, quantity, updateTotalPrice }) {

    const [qnt, setQnt] = useState(quantity);

    const clickHandle = (e) => {

        if (e.target.id == "increaseButton") {
            setQnt(qnt + 1);
            updateTotalPrice(price, true);
        } else {
            if (qnt == 1) {

            } else {
                setQnt(qnt - 1);
                updateTotalPrice(price, false);
            }

        }
    }




    return (
        <>
            <Container id="cartMainContainer" className="">
                <Row className="mt-5">
                    <h1 className="display-5">Nome prodotto</h1>
                </Row>
                <Row className="h-100">

                    {/* Colonna immagine */}
                    <Col xs="2" lg="3" xl="3" className="p-1">
                        <Container id="variantImgContainer" className="bg-danger h-100 d-flex justify-content-center align-items-center">
                            <img id="variantImg" src="" alt="prodotto" />
                        </Container>
                    </Col>

                    {/* Colonna quantità */}
                    <Col xs="6" lg="4" xl="5" className="d-flex justify-content-start align-items-center">
                        <h5 id="qntTitle" className="display-6 me-3"> Quantità: </h5>
                        <div id="qntDiv">
                            <Button id="decreaseButton" onClick={clickHandle}>-</Button>
                            <div id="qnt" className='fw-bold' contentEditable>{qnt}</div>
                            <Button id="increaseButton" onClick={clickHandle}>+</Button>
                        </div>
                    </Col>

                    {/* Colonna totale relativo */}
                    <Col xs="4" lg="4" xl="3" className="d-flex justify-content-center align-items-center pe-3">
                        <h5 className="">{(price * qnt).toFixed(2)}€</h5>
                    </Col>

                    

                </Row>
            </Container>
            <br />
            <br />
            <br />
            <hr />
        </>

    )

}

export default CartCard;