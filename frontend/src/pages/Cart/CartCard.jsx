import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './CartCard.css';
import trashBin from '../../assets/Images/trashBin.png';
import { changeCart,deleteFromCart } from '../../assets/Scripts/Virtual_Cart.js';

function CartCard({ quantity, updateTotalPrice, prodID, color, type, removeProd,}) {

    const [qnt, setQnt] = useState(quantity);
    const [prodName, setProdName] = useState("");
    const [frontalImg, setFrontalImg] = useState({});
    const [price, setPrice] = useState(0);
    const [Maxqnt, setMaxQnt] = useState(0);
    const userID = localStorage.getItem('userId');



    // Scarica prodotti, accessori e immagini
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
                    setPrice(product.prezzo);
                    setProdName(product.nome);
                    fetch(`http://localhost:3000/api/products/${prodID}/variants`, requestOptions)
                        .then((response) => response.json())
                        .then((result) => {
                        const variante = result.find(variante => variante.colore === color);
                        setMaxQnt(variante.quantita)
                        if(variante.quantita <= 0) removeHandleClick();
                        if(qnt > variante.quantita) setQnt(variante.quantita);
                        localStorage.setItem('Cart_Trig', "Trigger");
                    })
                .catch((error) => console.error(error));
                    setMaxQnt(product.quantita)
                })
                .catch((error) => console.error(error));
            
            
            setFrontalImg(`http://localhost:3000/api/products/${prodID}/${color}/frontale`);

        } else if (type === "accessry") {

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
                    setPrice(product.prezzo);
                    setMaxQnt(product.quantita)
                    if(product.quantita <= 0) removeHandleClick();
                    if(qnt > product.quantita) setQnt(product.quantita);
                    localStorage.setItem('Cart_Trig', "Trigger");
                })
                .catch((error) => console.error(error));

            setFrontalImg(`http://localhost:3000/api/accessories/${prodID}/image1`);
        }
    }, [prodID, color, type])

    //  Modifica la quantità nel db
    useEffect(() => {
        //if(qnt > Maxqnt) setQnt(Maxqnt);
        if(userID){
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "userId": `${userID}`,
            "productId": `${prodID}`,
            "color": `${color}`,
            "quantity": qnt,
            "type": `${type}`
        });

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/carts/updateQuantity", requestOptions)
            .then((response) => response.text())
            .then((result) =>         localStorage.setItem('Cart_Trig', "Trigger"))
            .catch((error) => console.error(error));
    }else{
        changeCart(prodID,qnt,color);
    }

    }, [qnt]);

    //  Modifica la quantità e modifica il prezzo totale
    const qntClickHandle = (e) => {
        if (e.target.id === "increaseButton") {
            if((qnt + 1) > Maxqnt) return
            setQnt(qnt + 1);
            updateTotalPrice(price, true);

        } else {
            if (qnt <= 1) {
                // Se la quantità è già 1, non fare nulla
            } else {
                setQnt(qnt - 1);
                updateTotalPrice(price, false);
            }
        }
        localStorage.setItem('Cart_Trig', "Trigger");
    }

    // rimuove un prodotto nel carrello
    const removeHandleClick = () => {
       removeProd(prodID, price * qnt, color);
       if(!userID) deleteFromCart(prodID,color);
    };


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
                            <Button id="decreaseButton" onClick={qntClickHandle}>-</Button>
                            <div id="qnt" className='fw-bold'>{qnt}</div>
                            <Button id="increaseButton" onClick={qntClickHandle}>+</Button>
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

