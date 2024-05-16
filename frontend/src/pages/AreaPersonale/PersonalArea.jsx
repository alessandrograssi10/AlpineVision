import React, { useState, useEffect } from 'react';
import { Button ,Form,Col,Row,Card,Image} from 'react-bootstrap';

import './PersonalArea.css'; // Importa il file CSS per gli stili
import shopping from '../../assets/Images/shopping2.png';
import shoppingrev from '../../assets/Images/shopping2rev.png';
import AuthServices from '../Login_SignUp/AuthService';
import { Link } from 'react-router-dom';
import { GetInfo } from '../../assets/Scripts/GetFromCart.js';
import { getProductInfo } from '../../assets/Scripts/PersonalArea/GetInfoFavourites.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import heart from '../../assets/Images/heart-3.png';
import boxordine from '../../assets/Images/boxordine.png';

import filledHeart from '../../assets/Images/heart-full.png';


function PersonalArea() {
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState(null); 
    const [walking, setWalking] = useState(true);
    const ruolo = localStorage.getItem("ruoloUser");
    const userId = localStorage.getItem('userId'); 
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);
    const [itemsInfo, setItemsInfo] = useState({});
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState({});
    const [Favorite, setFavorite] = useState([]);
    const [animateFav, setAnimateFav] = useState({});


    useEffect(() => {
        const timers = Object.keys(animateFav).map(id => {
            if (animateFav[id]) {
                return setTimeout(() => {
                    setAnimateFav(prev => ({ ...prev, [id]: false }));
                }, 200); // duration should match the CSS transition duration
            }
            return null;
        });
        return () => timers.forEach(timer => clearTimeout(timer));
    }, [animateFav]);
    const handleRoleChange = async (userId, newRole) => {
        setRoles(prevRoles => ({ ...prevRoles, [userId]: newRole }));

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newRole: newRole }),
            });

            if (!response.ok) {
                // Log the response status and status text for debugging
                console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();
            console.log('Success:', data);
            //localStorage.setItem("ruoloUser",newRole);

        } catch (error) {
            console.error('Error:', error);
            alert('There was an error updating the role. Please try again.');
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 

        if(!userId) return;
        fetch('http://localhost:3000/api/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);
    const getItemsInfo = async (order) => {
        const itemsInfoCopy = { ...itemsInfo };
        for (const item of order.items) {
            if (!itemsInfoCopy[item.productId]) {
                const info = await GetInfo(item);
                itemsInfoCopy[item.productId] = info;
            }
        }
        setItemsInfo(itemsInfoCopy);
    };

    useEffect(() => {
        // Quando cambiano gli ordini, ottieni le informazioni sugli elementi dell'ordine
        orders.forEach(order => getItemsInfo(order));
    }, [orders]);

    const isNameFemale = (name) => {
        return name && name.trim().toLowerCase().endsWith('a');
    };

    const saluto = userData && isNameFemale(userData.nome) ? 'Felice di rivederti nella tua Area Personale' : 'Felice di rivederti nella tua Area Personale';

    const handleAnimationEnd = () => {
        setWalking(walking => !walking);
    };

    useEffect(() => {
        AuthServices.redirectIfNotLoggedIn();
        const userId = localStorage.getItem('userId'); 

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('La risposta della rete non è stata buona');
                }
                const data = await response.json();
                setUserData(data); 
            } catch (error) {
                console.error('Si è verificato un problema con l\'operazione di fetch:', error);
            }
        };

        if (userId) {
            fetchData();
        }

        // Avvia l'animazione dopo un certo ritardo (ad esempio, 1 secondo)
        const timeout = setTimeout(() => {
            setWalking(true);
        }, 1000);

        // Pulisce il timeout quando il componente si smonta
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/orders/getOrdersByUserId/${userId}`);
                if (!response.ok) {
                    throw new Error('La risposta della rete non è stata buona');
                }
                const data = await response.json();
                setOrders(data); 
                console.log(data,"ordini");
            } catch (error) {
                console.error('Si è verificato un problema con l\'operazione di fetch:', error);
            }
        };

        fetchData();

    }, []);

    const toggleOrderDetails = (orderId) => {
        if (expandedOrderIds.includes(orderId)) {
            setExpandedOrderIds(expandedOrderIds.filter(id => id !== orderId));
        } else {
            setExpandedOrderIds([...expandedOrderIds, orderId]);
        }
    };


    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/api/favourites/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Errore nella richiesta fetch');
                    }
                    return response.json();
                })
                .then(async data => {
                    console.log("Ricevo i data", data);

                    const favoriteItems = data.favourites;
                    console.log("favoriteItems", favoriteItems);

                    try {
                        const fetchDetails = favoriteItems.map(item =>
                            getProductInfo(item.productId, item.type)
                                .then(info => ({ _id: item.productId, info }))
                                .catch(error => {
                                    console.error('Errore nel recuperare i dettagli dell\'articolo:', error);
                                    return null;
                                })
                        );
                        const detailsArray = await Promise.all(fetchDetails);
                        console.log("detailsArray", detailsArray);

                        const details = detailsArray.reduce((acc, current) => {
                            if (current && current.info) {
                                acc[current._id] = current.info;
                            }
                            return acc;
                        }, {});
                        console.log("FAVOURITE DETAILS", details);

                        setFavorite(details);
                    } catch (error) {
                        console.error('Si è verificato un errore durante il recupero dei dettagli degli articoli preferiti:', error);
                    }
                })
                .catch(error => {
                    console.error('Si è verificato un errore:', error);
                });
        }
    }, [userId]);


    

    return (
        <div className="personal-area-container m-0 p-0 mt-5">
            <div className="personal-area-row justify-content-center">
                <div className="personal-area-col">
                    <h1 className="personal-area-text-center mb-4">{saluto}, {userData ? `${userData.nome}` : 'USER SCONOSCIUTO'}!</h1>
                    
                    <img
                        src={shopping}
                        alt="Shopping"
                        className={`shopping-image ${walking ? 'shopping-image-walk' : ''} ${walking ? 'shopping-image-flip' : ''}`}
                        onAnimationEnd={handleAnimationEnd}
                    />
                    <img
                        src={shoppingrev}
                        alt="Shopping"
                        className={`shopping-image2 ${walking ? 'shopping-image-walk2' : ''} ${walking ? 'shopping-image-flip2' : ''}`}
                        onAnimationEnd={handleAnimationEnd}
                    />



<div className="personal-area-margin-bottom">
    <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">
        <h3>Ordini</h3>
        <div className="personal-area-order-grid">
            {orders && orders.length > 0 ? (
                orders.map(order => (
                    <div key={order._id} className="personal-area-order-card">
                        <Card>
                            <Card.Body>
                                <div className="personal-area-order-header" onClick={() => toggleOrderDetails(order._id)}>
                                <img src= {boxordine} alt="Box Ordine" className="boxordine-img" />
                                    <h4 style={{ display: 'inline-block', marginRight: '5px' }}>Ordine del {new Date(order.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'numeric', year: 'numeric' })} - Totale {order.items.reduce((total, item) => total + item.total, 0).toFixed(2)} €</h4>
                                    {expandedOrderIds.includes(order._id) ? (
                                        <FontAwesomeIcon icon={faAngleUp} />
                                    ) : (
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    )}
                                </div>
                                {expandedOrderIds.includes(order._id) && (
                                    <div>
                                        <h3>Informazioni di spedizione</h3>
                                        {/* Aggiungi sezioni aggiuntive */}
                                        <p>Ordine effettuato da: {order.nome} {order.cognome}</p>
                                        <p>Spedito a: {order.città}, {order.indirizzo}</p>
                                        <p>Informazioni di contatto: {order.telefono}</p>
                                        <hr />
                                        <h3>Informazioni sull'ordine</h3>
                                        <p>Stato: {order.status}</p>
                                        <p>Ordinato il: {new Date(order.createdAt).toLocaleString()}</p>
                                        {order.shippedAt && <p>Spedito il: {new Date(order.shippedAt).toLocaleString()}</p>}
                                        {order.deliveredAt && <p>Consegnato il: {new Date(order.deliveredAt).toLocaleString()}</p>}
                                        <p>Totale: {order.items.reduce((total, item) => total + item.total, 0).toFixed(2)} €</p>
                                        <p>Prodotti:</p>
                                        <ul className="personal-area-order-items-list">
                                            {order.items.map(item => (
                                                <li key={item.productId} className="personal-area-order-item">
                                                    {itemsInfo[item.productId] ? (
                                                        <>
                                                            <div>
                                                                {itemsInfo[item.productId].nome} - Colore: {itemsInfo[item.productId].colore || 'N/D'} - Quantità: {item.quantity} - Prezzo: {item.total.toFixed(2)} €
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Caricamento...
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                ))
            ) : (
                <p>Nessun ordine effettuato al momento.</p>
            )}
        </div>
    </div>
</div>



                   
                    <div className="personal-area-margin-bottom">
                        <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">
                            <h2>Articoli preferiti</h2>
                            {Object.keys(Favorite).length > 0 ? (
                                <div className="favorite-cards-container">
                                    {Object.values(Favorite).map((item, index) => (
                                        <Card as = {Link} to={item.type === 'product' ? `/product/${item.productId}` : `/accessory/${item.productId}`} key={index} className="card">
                                            <Card.Img variant="top" src={item.linkImmagine} alt={item.nome} />
                                            <Card.Body>
                                                <Card.Title>{item.nome}</Card.Title>
                                                <Card.Text>
                                                    Colore: {item.colore || 'N/D'}<br />
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Card.Text>{item.prezzo} €</Card.Text>
                                        <Image className={`heart ${animateFav[item._id] ? 'animate' : ''}`}  key={`${item._id}-${'filledHeart'}`}   src={filledHeart} style={{ width: '25px', height: '25px' }} alt="Descrizione Immagine" />
                                    </div>                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p>Nessun articolo preferito al momento.</p>
                            )}
                        </div>
                    </div>


    

                    

                    {(ruolo === 'admin' || ruolo === 'editor-blog' ||ruolo === 'editor-prodotti') && (
                        <div className="personal-area-margin-bottom" >
                            <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">
                                <h4>Autorizzazione utente: {ruolo.toUpperCase()}</h4>
                                <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">

                                {(ruolo === 'admin' || ruolo === 'editor-blog') && (
                                    <div className="personal-area-margin-bottom m-2" >
                                        <Button as = {Link} to = "/blogedit" className={`button-black-prod-nomon m-2 mb-2 `} variant="outline-dark pl-0 ml-0" size="lg">
                                            <h4>EDITOR BLOG</h4>
                                        </Button>
                                </div>
                                )}
                                {(ruolo === 'admin' || ruolo === 'editor-prodotti') && (
                                    <div className="personal-area-margin-bottom m-2" >
                                        <Button as = {Link} to = "/editor"className={`button-black-prod-nomon m-2 MB-2  `} variant="outline-dark" size="lg">
                                            <h4>EDITOR PRODOTTI</h4>
                                        </Button>
                                </div>
                                )}
                                 {(ruolo === 'admin') && (
                                    <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">
                                    <h4>GESTIONE UTENTI</h4>
                                    <div className="scrollable-container-pa">
                                    <Form>
            {users?.filter(user => user._id !== userId).map((user) => (
                <div className="scroll-item-pa m-3" key={user._id}>
                    <div className="user-details-pa">
                        <h4>{user.email}</h4>
                        <Form.Group as={Row} className="role-selection">
                            <Col>
                                <Form.Check 
                                    type="radio"
                                    label="User"
                                    name={`role-${user._id}`}
                                    value="user"
                                    checked={roles[user._id] ? roles[user._id] === 'user' : user.ruolo === 'user'}
                                    onChange={() => handleRoleChange(user._id, 'user')}
                                />
                            </Col>
                            <Col>
                                <Form.Check 
                                    type="radio"
                                    label="Editor Blog"
                                    name={`role-${user._id}`}
                                    value="editor-blog"
                                    checked={roles[user._id] ? roles[user._id] === 'editor-blog' : user.ruolo === 'editor-blog'}
                                    onChange={() => handleRoleChange(user._id, 'editor-blog')}
                                />
                            </Col>
                            <Col>
                                <Form.Check 
                                    type="radio"
                                    label="Editor Prodotti"
                                    name={`role-${user._id}`}
                                    value="editor-prodotti"
                                    checked={roles[user._id] ? roles[user._id] === 'editor-prodotti' : user.ruolo === 'editor-prodotti'}
                                    onChange={() => handleRoleChange(user._id, 'editor-prodotti')}
                                />
                            </Col>
                            <Col>
                                <Form.Check 
                                    type="radio"
                                    label="Admin"
                                    name={`role-${user._id}`}
                                    value="admin"
                                    checked={roles[user._id] ? roles[user._id] === 'admin' : user.ruolo === 'admin'}
                                    onChange={() => handleRoleChange(user._id, 'admin')}
                                />
                            </Col>
                        </Form.Group>
                    </div>
                </div>
            ))}
        </Form>
                            </div>
                                </div>
                                )}
                                 </div>

                            </div>
                        </div>
                    )}

                    {/* Sezione: Possibilità di logout */}
                    <div className="personal-area-text-center">
                        <button className="personal-area-button personal-area-button-danger" onClick={AuthServices.dologout}>Esci</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalArea;
