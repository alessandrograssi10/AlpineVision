import React, { useState, useEffect } from 'react';

export const HeaderCart = ({ onChangeCart }) => {
  const [qnt, setQnt] = useState(0);
  const userId = localStorage.getItem('userId');
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992); //verifica la dimensione dello schermo

   //evento che viene chiamato all ridimensionamento della schermata
   useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('Cart_Trig', "Trigger");
  }, []);

  useEffect(() => {
    const fetchData = () => {
      const item = localStorage.getItem('Cart_Trig');
      if (item !== '') {
        console.log("item", item);

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        if (!userId) return;
        fetch(`http://localhost:3000/api/carts/${userId}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (Array.isArray(result) && result) {
              const totalQuantita = result.reduce((sum, item) => sum + item.quantity, 0);
              setQnt(totalQuantita); 
              console.log("quant", totalQuantita);
            }

          })
          .catch((error) => console.error(error));
        localStorage.setItem('Cart_Trig', "");
      }
    }

    const intervalId = setInterval(fetchData, 50); 
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
