import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';
import Immagine2 from '../../assets/Images/Asset 1.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';

import './Header.css';

export const Header = () => {
  const [showProductBox, setShowProductBox] = useState(false);
  const [showAssistanceBox, setShowAssistanceBox] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Stato per gestire l'animazione di chiusura

 
  const toggleProductBox = () => {
    if (showProductBox) {
      closeAllBoxes();
    } else {
        setShowProductBox(true);
        setShowAssistanceBox(false);
        setIsClosing(false);
    }
};

  const toggleAssistanceBox = () => {
    if (showAssistanceBox) {
      closeAllBoxes();
    } else {
    
      setShowAssistanceBox(!showAssistanceBox);
      setShowProductBox(false);
      setIsClosing(false); // Resetta lo stato di chiusura
    }
  };

  const closeAllBoxes = () => {
      setIsClosing(true); // Inizia l'animazione di chiusura
      setTimeout(() => { // Dà tempo all'animazione di completarsi
          setIsClosing(false); // Resetta lo stato di chiusura per future aperture
          setShowProductBox(false);
          setShowAssistanceBox(false);
    
      }, 200); // Assicurati che questo valore corrisponda alla durata dell'animazione CSS
  };

  useEffect(() => {
      const closeAllBoxOnScroll = () => {
          if(showProductBox || showAssistanceBox) {
              closeAllBoxes();
          }
      };

      window.addEventListener('scroll', closeAllBoxOnScroll);
      return () => window.removeEventListener('scroll', closeAllBoxOnScroll);
  }, [showProductBox, showAssistanceBox]); // Aggiornato per includere le dipendenze

  const isAnyBoxOpen = showProductBox || showAssistanceBox || isClosing;


    return (
        <>
            <Navbar expand="lg" className="custom-navbar" >
                <Container>
                    <Navbar.Brand href="/home" className="navbar-brand-bold">
                        <Image src={Immagine2} width="50" className="d-inline-block align-center logo" alt="Logo" />
                        ALPINE VISION
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" style={{height:'100%', package:'100%'}}>
                        <Nav className="me-auto">
                            <Nav.Link href="#home" onMouseOver={toggleProductBox} onMouseLeave={toggleProductBox}>PRODUCTS</Nav.Link>
                            <Nav.Link href="#link" onClick={toggleAssistanceBox}>ASSISTANCE</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link href="#search"><Image src={SearchIcon} width="20" className="icon" alt="Search" /></Nav.Link>
                            <Nav.Link href="#cart"><Image src={Car} width="20" className="icon" alt="Cart" /></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {isAnyBoxOpen && <div className={`backdrop ${isClosing ? 'closing' : ''}`} onClick={closeAllBoxes}></div>}

            {showProductBox && (
                <div className={`info-box ${isClosing ? 'closing' : ''}`}>
                    <p>Qui puoi inserire informazioni sui prodotti o un form.</p>
                    <button onClick={closeAllBoxes}>Chiudi</button>
                </div>
            )}
            {showAssistanceBox && (
                <div className={`info-box ${isClosing ? 'closing' : ''}`}>
                    <p>Haloooooooooa</p>
                    <button onClick={closeAllBoxes}>Chiudi</button>
                </div>
            )}
        </>
    );
};

export default Header;
