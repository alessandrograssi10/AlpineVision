import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Image ,Row,Col, Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Immagine2 from '../../assets/Images/Asset 1.png';
import Immagine3 from '../../assets/Images/maskL.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';
import Skier from '../../assets/Images/skier.png';
import './Header.css';



export const Header = () => {
  const [showProductBox, setShowProductBox] = useState(false);
  const [showAssistanceBox, setShowAssistanceBox] = useState(false);
  const [showSearchBox, setShowSearcBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showAccessoriesBox, setShowAccessoriesBox] = useState(false);
  const [showBlogBox, setShowBlogBox] = useState(false);

  const [isClosing, setIsClosing] = useState(false); // Stato per gestire l'animazione di chiusura
  const [isOpening, setIsOpening] = useState(false); // Stato per gestire l'animazione di chiusura

  const isAnyBoxOpen = showBlogBox || showAccessoriesBox || showProductBox || showAssistanceBox|| showSearchBox || isClosing;
  const [timeoutId, setTimeoutId] = useState(null);

//
const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992); // Bootstrap lg breakpoint
useEffect(() => {
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 992);
  };
  
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
 
const handleLinkClick = (linkName) => {
  closeAllBoxes();
};

const cancelToggleBox = () => {
  if(!isLargeScreen) return;
  clearTimeout(timeoutId);
};
const toggleBlogBox = () => {
  if(!isLargeScreen) return;
  cancelToggleBox();
  if (!showBlogBox) { 
    const id = setTimeout(() => {
      setShowBlogBox(true);
      setShowAccessoriesBox(false);
      setShowAssistanceBox(false);
      setShowProductBox(false);
      setShowSearcBox(false);

    }, 100);
    setTimeoutId(id);
  }
};
const toggleAccessoriestBox = () => {
  if(!isLargeScreen) return;
  if (!showAccessoriesBox) { 
    const id = setTimeout(() => {
      setShowAccessoriesBox(true);
      setShowAssistanceBox(false);
      setShowProductBox(false);
      setShowBlogBox(false);
      setShowSearcBox(false);
    }, 100);
    setTimeoutId(id);
  }
};

  const toggleProductBox = () => {
    if(!isLargeScreen) return;
    if (!showProductBox) {
      const id = setTimeout(() => {

        setShowProductBox(true);
        setShowAssistanceBox(false);
        setShowAccessoriesBox(false);
        setShowBlogBox(false);
        setShowSearcBox(false);
      }, 100);
      setTimeoutId(id);
      }
};

  const toggleAssistanceBox = () => {
    if(!isLargeScreen) return;
    if (!showAssistanceBox) {
      const id = setTimeout(() => {

      setShowAssistanceBox(!showAssistanceBox);
      setShowProductBox(false);
      setShowAccessoriesBox(false);
      setShowBlogBox(false);
      setShowSearcBox(false);
    }, 100);
    setTimeoutId(id);
    }
  };
  const toggleSearchBox = () => {
    if(!isLargeScreen) return;
    if (!showSearchBox) {
      OpenAllBoxes();
      const id = setTimeout(() => {
      setShowSearcBox(true);
      setShowAssistanceBox(false);
      setShowProductBox(false);
      setShowAccessoriesBox(false);
      setShowBlogBox(false);
    }, 100);
    
    setTimeoutId(id);
    }
    else{
      {closeAllBoxes()}
    }
  };
  
  const OpenAllBoxes = () => {
    console.log("apertura");

    if(!isLargeScreen || showSearchBox) return;
    setIsOpening(true); // Inizia l'animazione di chiusura
    //
    setTimeout(() => { // Dà tempo all'animazione di completarsi
        setIsOpening(false); // Resetta lo stato di chiusura per future aperture
    
      }, 200); // Assicurati che questo valore corrisponda alla durata dell'animazione CSS
};
  const closeAllBoxes = () => {
    console.log("chiusura");

    if(!isLargeScreen) return;
    if(!isAnyBoxOpen) return;
      setIsClosing(true); // Inizia l'animazione di chiusura
      setTimeout(() => { // Dà tempo all'animazione di completarsi
          setIsClosing(false); // Resetta lo stato di chiusura per future aperture
          setShowProductBox(false);
          setShowAssistanceBox(false);
          setShowAccessoriesBox(false);
          setShowBlogBox(false);
          setShowSearcBox(false);
      }, 200); // Assicurati che questo valore corrisponda alla durata dell'animazione CSS
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Qui puoi aggiungere la logica per effettuare la ricerca
  };

  return (
    <>
        <Navbar id="top" expand="lg" className="custom-navbar" onMouseLeave={closeAllBoxes}>
            <Navbar.Brand as={Link} to="/home" className="navbar-brand-bold">
                <Image src={Immagine2} width="50" className="d-inline-block align-center logo" alt="Logo" />
                ALPINE VISION
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav to="/Blog" className="me-auto" onMouseEnter={OpenAllBoxes} onMouseLeave={closeAllBoxes}>
                    <div onMouseEnter={toggleProductBox} onMouseLeave={cancelToggleBox}>
                        <Nav.Link as={Link} to="/Products" onClick={() => handleLinkClick('Products')} className={`bold ${showProductBox ? 'hovered' : ''}`}>PRODOTTI</Nav.Link>
                        {showProductBox && (
                            <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                <Row>
                                    <Col md={4} className="d-flex flex-column">
                                        <p>MASCHERE</p>
                                        <Image src={Immagine3} width="100" className="d-inline-block align-center logo mt-2 mb-3" alt="Logo" />
                                        <p>-Eternal Aura</p>
                                        <p>-Ethereal Spirit</p>
                                    </Col>
                                    <Col md={4} className="d-flex flex-column">
                                        <p>OCCHIALI</p>
                                        <p>-Clarity Peaks</p>
                                        <p>-Horizon Gaze</p>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>

                    <div onMouseEnter={toggleAccessoriestBox} onMouseLeave={cancelToggleBox}>
                        <Nav.Link as={Link} to="/Accessories" onClick={() => handleLinkClick('Accessories')} className={`bold ${showAccessoriesBox ? 'hovered' : ''}`}>ACCESSORI</Nav.Link>
                        {showAccessoriesBox && (
                            <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                <p>accessori vari.</p>
                            </div>
                        )}
                    </div>

                    <div onMouseEnter={toggleBlogBox} onMouseLeave={cancelToggleBox}>
                        <Nav.Link as={Link} to="/Blog" onClick={() => handleLinkClick('Blog')} className={`bold ${showBlogBox ? 'hovered' : ''}`}>BLOG</Nav.Link>
                        {showBlogBox && (
                            <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                <p>blog vari.</p>
                            </div>
                        )}
                    </div>

                    <div onMouseEnter={toggleAssistanceBox} onMouseLeave={cancelToggleBox}>
                        <Nav.Link as={Link} to="/Support" onClick={() => handleLinkClick('Support')} className={`bold ${showAssistanceBox ? 'hovered' : ''}`}>ASSISTENZA</Nav.Link>
                        {showAssistanceBox && (
                            <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                <p></p>
                            </div>
                        )}
                    </div>
                </Nav>
                <Nav className="ms-auto" >
                    <Nav>
                        <div >
                            <Nav.Link as={Link} className={`bold ${showSearchBox ? 'hovered' : ''}`}><Image onClick={() => toggleSearchBox()} src={SearchIcon} width="20" className="icon" alt="Search" /></Nav.Link>
                            {showSearchBox && (
                                <div  className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                    <Form className="mt-5 mb-5">
                                        <Form.Control
                                            type="text"
                                            placeholder="Cerca..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                    </Form>
                                </div>
                            )}
                        </div>
                    </Nav>
                    <Nav.Link onMouseEnter={closeAllBoxes} href="/Cart"><Image src={Car} width="20" className="icon" alt="Cart" /></Nav.Link>
                    <Nav.Link onMouseEnter={closeAllBoxes} href="/Login"><Image src={Skier} width="20" className="icon" alt="Login" /></Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>

        {isAnyBoxOpen && <div className={`backdrop ${isClosing ? 'closing' : 'opening'}`} onClick={closeAllBoxes}></div>}
    </>
);

};

export default Header;