import { useState, useEffect } from 'react';

function PersonalArea() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userData, setUserData] = useState(null); 

    const isNameFemale = (name) => {
        return name && name.trim().toLowerCase().endsWith('a');
    };

    const saluto = userData && isNameFemale(userData.nome) ? 'Bentornata' : 'Bentornato';

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setUserData(data); // Aggiorna il valore di userData con i dati ricevuti
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        if (userId) {
            fetchData();
        }
    }, []);



    const handleLogout = () => {
      
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null); 
        window.location.href = "/";
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">{saluto}, {userData ? `${userData.nome} ${userData.cognome}` : 'USER SCONOSCIUTO'}!</h1>

                    {/* Sezione: I miei ordini */}
                    <div className="mb-4">
                        <div className="container border rounded p-4">
                            <h2>I miei ordini</h2>
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
                    <div className="mb-4">
                        <div className="container border rounded p-4">
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
                    <div className="text-center">
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalArea;
