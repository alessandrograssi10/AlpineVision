import React, { useState, useEffect } from 'react';

export const HeaderCart = () => {
  const [qnt, setQnt] = useState(0);
  const userId = localStorage.getItem('userId');
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992); //verifica la dimensione dello schermo

  // Evento che viene chiamato all ridimensionamento della schermata
  useEffect(() => {
    const handleResize = () => { setIsLargeScreen(window.innerWidth >= 992); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); };
  }, []);

  useEffect(() => {
    localStorage.setItem('Cart_Trig', "Trigger"); // Aggiornamento del carrello quando si entra nel sito
  }, []);

  //Caricamento della quantità nel carrello
  useEffect(() => {
     const fetchData = () => {
        // Caricamento di Cart_Trig ed in caso esce
        const item = localStorage.getItem('Cart_Trig');
        if (item !== null && item !== undefined && item !== '') {
            // Se l'utente è loggato prende del informazioni dal backend
            // Se l'utente non è loggato prendel le informazioni dal localstorage
            if (userId) {
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
                        if (Array.isArray(result) && result) {
                            const totalQuantita = result.reduce((sum, item) => sum + item.quantity, 0);
                            setQnt(totalQuantita); 
                        }
                    })
                    .catch((error) => console.error(error));
            } else {
              var cart = JSON.parse(localStorage.getItem("virtualCart") || "[]");
              if (Array.isArray(cart) && cart) {
                    const totalQuantita = cart.reduce((sum, item) => sum + item.quantity, 0);
                    setQnt(totalQuantita); 
                }
            }
            localStorage.setItem('Cart_Trig', "");
        }
    };

    // Imposta l'intervallo
    const intervalId = setInterval(fetchData, 50);
    fetchData();
    return () => clearInterval(intervalId);
  }, []);


  return (
    <>
      {qnt > 0 && isLargeScreen && ( 
        <span className="position-absolute top-0 mt-0 start-50 badge m-0 p-0 p-1 mt-1 text-colored-navbar">
          {qnt}
          <span className="visually-hidden">elementi nel carrello</span>
        </span>
      )}
    </>
  );
}

export default HeaderCart;
