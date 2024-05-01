import React, { useState, useEffect } from 'react';
import './PersonalArea.css'; // Importa il file CSS per gli stili
import shopping from '../../assets/Images/shopping2.png';
import AuthServices from '../Login_SignUp/AuthService';

function PersonalArea() {
    const [orders, setOrders] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userData, setUserData] = useState(null); 
    const [walking, setWalking] = useState(false);

    const isNameFemale = (name) => {
        return name && name.trim().toLowerCase().endsWith('a');
    };

    const saluto = userData && isNameFemale(userData.nome) ? 'Bentornata nella tua Area Personale' : 'Bentornato nella tua Area Personale';

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
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserData(data); 
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
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

   
    return (
        <div className="personal-area-container mt-5">
            <div className="personal-area-row justify-content-center">
                <div className="personal-area-col">
                    <h1 className="personal-area-text-center mb-4">{saluto}, {userData ? `${userData.nome}` : 'USER SCONOSCIUTO'}!</h1>

                    {/* Sezione: I miei ordini */}
                    <div className="personal-area-margin-bottom">
                        <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">
                            <h2>I miei ordini</h2>
                            <img
                            src={shopping}
                            alt="Shopping"
                            className={`shopping-image ${walking ? 'shopping-image-walk' : ''} ${walking ? 'shopping-image-flip' : ''}`}
                            onAnimationEnd={handleAnimationEnd}
                        />
                            {orders.length > 0 ? (
                                orders.map(order => (
                                    <div key={order.id}>
                                        {/* Visualizza dettagli ordine */}
                                    </div>
                                ))
                            ) : (
                                <p>Nessun ordine disponibile al momento.</p>
                            )}
                        </div>
                    </div>

                    {/* Sezione: Articoli preferiti */}
                    <div className="personal-area-margin-bottom">
                        <div className="personal-area-container personal-area-border personal-area-rounded personal-area-padding">
                            <h2>Articoli preferiti</h2>
                            {favorites.length > 0 ? (
                                favorites.map(item => (
                                    <div key={item.id}>
                                        {/* Visualizza dettagli articolo */}
                                    </div>
                                ))
                            ) : (
                                <p>Nessun articolo preferito al momento.</p>
                            )}
                        </div>
                    </div>

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
