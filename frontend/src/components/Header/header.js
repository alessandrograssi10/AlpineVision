import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Image, Form } from 'react-bootstrap';
import { Link ,useNavigate} from 'react-router-dom';
import Logo from '../../assets/Images/Asset 1.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';
import Skier from '../../assets/Images/skier.png';
import BurgerBar from '../../assets/Images/burger-bar.png';
import './Header.css';
import HeaderProducts from './Boxes/header_products';
import HeaderAccessories from './Boxes/header_accessories';
import HeaderSearch from './Boxes/header_search';
import HeaderCart from './Boxes/header_cart';
import HeaderBlog from './Boxes/header_blog';
import {isMobile} from 'react-device-detect';

import AuthServices from '../../pages/Login_SignUp/AuthService';

export const Header = () => {
  const [currentBox, setCurrentBox] = useState(null); //Viene salvato il nome della tendina aperta
  const [isClosing, setIsClosing] = useState(false); //Variabile per l'animazione di chiusura tendina
  const [isOpening, setIsOpening] = useState(false); //Variabile per l'animazione di apertura tendina
  const [timeoutId, setTimeoutId] = useState(null); //id timer
  const [expanded, setExpanded] = useState(false); //variabile per apertura/chiusura collapse
  const userID = localStorage.getItem('userId'); // ID utente
  let navigate = useNavigate(); // per la navigazione tra i link

  
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992 && !isMobile); // verifica la dimensione dello schermo e se è di tipo mobile


   // Evento che viene chiamato al ridimensionamento della schermata
   useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992 && !isMobile);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //chiusura delle tendine qunado viene cliccato un pulsante
  const handleLinkClick = () => {
    setExpanded(false);
    closeAllBoxes();
  };

  //annulla l'esecuzione del timer
  const cancelToggleBox = () => {
    if (!isLargeScreen) return;
    clearTimeout(timeoutId);
  };

  //Viene selezionata la tendina da aprire
  const toggleBox = (boxName) => {
    if (!isLargeScreen) return; //se la navbar ha il toggle disabilita le tendine
    cancelToggleBox();
    if (currentBox !== boxName) {
      //if (currentBox === 'showSearchBox') OpenAllBoxes();
      const id = setTimeout(() => {
        setCurrentBox(boxName);
      }, 100);
      setTimeoutId(id);
    } else {
      if (currentBox === 'showSearchBox') closeAllBoxes();
    }
  };

  //Fa si che si avvii l'animazione di apertura delle tendine
  const OpenAllBoxes = () => {
    if (!isLargeScreen || currentBox) return;
    //cancelToggleBox();

    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
    }, 200);
  };

  //Chiusura di tutte le tendine
  const closeAllBoxes = () => {
    if (!isLargeScreen || !currentBox) return;
    setIsClosing(true);
    setTimeout(() => {
      setCurrentBox(null);
      setIsClosing(false);
    }, 200);
  };

  // L'utente viene reindirizzato se è loggato
  const handleLoginClick = () => {
    if (AuthServices.isLoggedIn()) {
      handleLinkClick('/areapersonale');
      navigate(`/areapersonale`);
    } else {
      handleLinkClick('/login');
      navigate(`/login`);
    }
  }

  // Reindirizzamento sul carrello
  const handleCartClick = () => {
    if (AuthServices.isLoggedIn()) {
      handleLinkClick('/cart');
      navigate(`/cart`);
    }
    else{
      handleLinkClick('/cart');
      navigate(`/cart`);
    }
  }

  // Reindirizzamento su cerca
  const handleSearchClick = () => {
    if (isLargeScreen) {
      toggleBox("showSearchBox");
    } else {
      handleLinkClick('/search');
      console.log("diocan")
      navigate(`/search`);
    }
  } 

  return (
    <>

      {/* Navbar */}

      <Navbar id="top" expand="lg" className="custom-navbar" expanded={expanded} onMouseLeave={closeAllBoxes}>
        
        {/* Logo e Scritta di AlpineVision */}

        <Navbar.Brand as={Link} to="/home" className="navbar-brand-bold" onClick={handleLinkClick}>
          <Image src={Logo} width="50"  className="d-inline-block align-center logo" alt="Logo" />
          ALPINE VISION
        </Navbar.Brand>

        {/* Toggle per gli elementi con lo schermo piccolo */}

        <Navbar.Toggle className='no-border' aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)}/>

        {/* Elementi della navbar con schermo grande */}

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onMouseEnter={OpenAllBoxes} onMouseLeave={closeAllBoxes}>

            {/* Box Prodotti */}

            <div onMouseEnter={() => toggleBox("showProductBox")} onMouseLeave={cancelToggleBox}>
              <Nav.Link as={Link} to="/products" onClick={() => handleLinkClick('Products')} className={`bold ${currentBox === 'showProductBox' ? 'hovered' : ''}`}>
                <div className="hover-underline-animation">PRODOTTI</div>
              </Nav.Link>
              {currentBox === 'showProductBox' && (
                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                  <HeaderProducts onCloseAllBoxes={closeAllBoxes} />
                </div>
              )}
            </div>

            {/* Box Accessori */}

            <div onMouseEnter={() => toggleBox("showAccessoriesBox")} onMouseLeave={cancelToggleBox}>
              <Nav.Link as={Link} to="/accessories" onClick={() => handleLinkClick('Accessories')} className={`bold ${currentBox === 'showAccessoriesBox' ? 'hovered' : ''}`}>
                <div className="hover-underline-animation">ACCESSORI</div>
              </Nav.Link>
              {currentBox === 'showAccessoriesBox' && (
                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                  <HeaderAccessories onCloseAllBoxes={closeAllBoxes} />
                </div>
              )}
            </div>

            {/*Box Blog*/}

            <div onMouseEnter={() => toggleBox('showBlogBox')} onMouseLeave={cancelToggleBox}>
              <Nav.Link as={Link} to="/blog" onClick={() => handleLinkClick('Blog')} className={`bold ${currentBox === 'showBlogBox' ? 'hovered' : ''}`}>
                <div className="hover-underline-animation">BLOG</div>
              </Nav.Link>
              {currentBox === 'showBlogBox' && (
                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                  <HeaderBlog onCloseAllBoxes={closeAllBoxes} />
                </div>
              )}
            </div>

            {/* Box Chi siamo */}

            <Nav>
              <Nav.Link as={Link} to="/support" onMouseLeave={OpenAllBoxes} onMouseEnter={() => closeAllBoxes()} onClick={() => handleLinkClick('Support')} className={`justify-content-center bold ${currentBox === 'showAboutUs' ? 'hovered' : ''}`}>
                <div className="hover-underline-animation">CHI SIAMO</div>
              </Nav.Link>
            </Nav>
          </Nav>

          <Nav className="ms-auto">
            <Nav>

              {/* Box Cerca */}

              <div>
                <div onClick={handleSearchClick}>
                  <Nav.Link as={Link} onMouseEnter={OpenAllBoxes} className={`bold ${currentBox === 'showSearchBox' ? 'hovered' : ''}`} >
                    <Image src={SearchIcon} width="20" className="icon d-none d-lg-inline-block d-xl-inline-block" alt="Search" />
                    <span  className="d-inline-block d-lg-none d-xl-none align-center logo"><h5 className='text-box-prod'>CERCA</h5></span>
                  </Nav.Link>
                </div>
                {currentBox === 'showSearchBox' && (
                  <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                    <HeaderSearch onCloseAllBoxes={closeAllBoxes} />
                  </div>
                )}
              </div>
            </Nav>
            {/* Bottone carrello */}

            <Nav.Link onMouseEnter={closeAllBoxes} onClick={handleCartClick} className="position-relative">
              <Image src={Car} width="20" className="icon d-none d-lg-inline-block d-xl-inline-block" alt="Cart" />
              <span className="hover-underline-animation bold d-inline-block d-lg-none d-xl-none align-center logo "><h5 className='text-box-prod'>CARRELLO</h5></span>
              <HeaderCart />
            </Nav.Link>
            {/* Bottone login o areapersonale */}

            <Nav.Link onMouseEnter={closeAllBoxes} onClick={handleLoginClick}>
              <Image src={Skier} width="20" className="icon d-none d-lg-inline-block d-xl-inline-block" alt="Login" />
              <span className="hover-underline-animation bold d-inline-block d-lg-none d-xl-none align-center logo"><h5 className='text-box-prod'>{!userID ? "LOGIN" : "AREA PERSONALE"}</h5></span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/*Componente per la chiusura delle tendine e per le animazioni*/}
      
      {(currentBox || isClosing) && <div className={`backdrop ${isClosing ? 'closing' : 'opening'}`} onClick={closeAllBoxes}></div>}
    </>
  );
};

export default Header;
