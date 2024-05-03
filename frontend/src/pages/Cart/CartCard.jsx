import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './CartCard.css'
import trashBin from '../../assets/Images/trashBin.png';

function CartCard({ price, quantity, updateTotalPrice, prodID}) {

    const [qnt, setQnt] = useState(quantity);
    const [prodName, setProdName] = useState("");

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

    const removeHandleClick = () => {

    }

    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/products", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                const product = result.find(product => product._id === prodID);
                setProdName(product.nome);
            })
            .catch((error) => console.error(error));


    })


    return (
        <>
            <Container id="cartMainContainer" className="">
                <Row className="mt-5">
                    <h1 className="display-5">{prodName}</h1>
                </Row>
                <Row className="h-100">

                    {/* Colonna immagine */}
                    <Col xs="2" lg="2" xl="2" className="p-1">
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

                <Row className="mt-2">
                    <Col xs="6"className="fs-3">
                        Rimuovi
                        <Button id="removeButton" className="ms-3">
                            <div id="trashBinImgDiv">
                                <img src={trashBin} alt="" />
                            </div>
                        </Button>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <br />
            <br />
            <br />
            <hr />
        </>

    )

}

export default CartCard;