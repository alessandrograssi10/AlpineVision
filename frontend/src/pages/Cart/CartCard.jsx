import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './CartCard.css';
import trashBin from '../../assets/Images/trashBin.png';

function CartCard({ price, quantity, updateTotalPrice, prodID, color, type, removeProd }) {

    const [qnt, setQnt] = useState(quantity);
    const [prodName, setProdName] = useState("");
    const [frontalImg, setFrontalImg] = useState({});
    const [currentProduct, setCurrentProduct] = useState({});
    
    useEffect(() => {

        if (type === "product") {
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

                    setCurrentProduct(product);
                    setProdName(product.nome);
                })
                .catch((error) => console.error(error));

            setFrontalImg(`http://localhost:3000/api/products/${prodID}/${color}/frontale`);

        } else if (type === "accessory") {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/accessories", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    const product = result.find(product => product._id === prodID);
                    setProdName(product.name);
                })
                .catch((error) => console.error(error));

            setFrontalImg(`http://localhost:3000/api/accessories/${prodID}/image1`);
        }
    }, [prodID, color, type])

    const clickHandle = (e) => {
        if (e.target.id === "increaseButton") {
            setQnt(qnt + 1);
            updateTotalPrice(price, true);
        } else {
            if (qnt === 1) {
                // Se la quantità è già 1, non fare nulla
            } else {
                setQnt(qnt - 1);
                updateTotalPrice(price, false);
            }
        }
    }

    const removeHandleClick = () => {
        removeProd(prodID);
    }

    return (
        <>
            <Container id="cartMainContainer">

                <Row className="h-100">
                    {/* Colonna immagine */}
                    <Col xs="2" lg="2" xl="2" className="p-1">
                        <Container id="variantImgContainer" className="h-100 d-flex justify-content-center align-items-center">
                            <img src={frontalImg} alt="prodotto" className="cartproductimage" />
                        </Container>
                    </Col>

                    {/* Colonna nome prodotto e colore */}
                    <Col xs="4" lg="3" xl="3" className="d-flex flex-column justify-content-center">
                        <h5 id="productName" className="mb-2">{prodName}</h5>
                        <span id="productColor">{color}</span>
                    </Col>

                    <Col xs="6" lg="4" xl="5" className="d-flex justify-content-start align-items-center custom-col">
    <h5 id="qntTitle" className=" custom-col me-2">Quantità:</h5>
    <div id="qntDiv">
        <Button id="decreaseButton" onClick={clickHandle}>-</Button>
        <div id="qnt" className='fw-bold'>{qnt}</div>
        <Button id="increaseButton" onClick={clickHandle}>+</Button>
    </div>
</Col>


                    {/* Colonna totale relativo */}
                    <Col xs="12" lg="3" xl="2" className="d-flex justify-content-end align-items-center pe-3">
                        <h5 className="">{(price * qnt).toFixed(2)}€</h5>
                        <Button id="removeButton" className="ms-3" onClick={removeHandleClick}>
                            <div id="trashBinImgDiv">
                                <img src={trashBin} alt="" />
                            </div>
                        </Button>
                    </Col>
                </Row>     
            </Container>
            <hr />
        </>
    )
}

export default CartCard;

