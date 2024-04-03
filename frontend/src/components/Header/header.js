import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Image ,Row,Col} from 'react-bootstrap';
import Immagine2 from '../../assets/Images/Asset 1.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';
import './Header.css';



export const Header = () => {
  const [showProductBox, setShowProductBox] = useState(false);
  const [showAssistanceBox, setShowAssistanceBox] = useState(false);
  const [showAccessoriesBox, setShowAccessoriesBox] = useState(false);
  const [showBlogBox, setShowBlogBox] = useState(false);

  const [isClosing, setIsClosing] = useState(false); // Stato per gestire l'animazione di chiusura
  const [isOpening, setIsOpening] = useState(false); // Stato per gestire l'animazione di chiusura

  const isAnyBoxOpen = showBlogBox || showAccessoriesBox || showProductBox || showAssistanceBox || isClosing;
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
 
const cancelToggleBox = () => {
  clearTimeout(timeoutId);
  // Potresti voler nascondere il box qui, o gestire l'evento in altro modo
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
    }, 100);
    setTimeoutId(id);
    }
  };
  
  const OpenAllBoxes = () => {
    if(!isLargeScreen) return;
    setIsOpening(true); // Inizia l'animazione di chiusura
    setTimeout(() => { // Dà tempo all'animazione di completarsi
        setIsOpening(false); // Resetta lo stato di chiusura per future aperture
    
      }, 200); // Assicurati che questo valore corrisponda alla durata dell'animazione CSS
};
  const closeAllBoxes = () => {
    if(!isLargeScreen) return;
    if(!isAnyBoxOpen) return;
      setIsClosing(true); // Inizia l'animazione di chiusura
      setTimeout(() => { // Dà tempo all'animazione di completarsi
          setIsClosing(false); // Resetta lo stato di chiusura per future aperture
          setShowProductBox(false);
          setShowAssistanceBox(false);
          setShowAccessoriesBox(false);
          setShowBlogBox(false);

      }, 200); // Assicurati che questo valore corrisponda alla durata dell'animazione CSS
  };

    return (
        <>
            <Navbar expand="lg" className="custom-navbar" >
             {/*<Container className='con'>*/} 

                    <Navbar.Brand href="/home" className="navbar-brand-bold">
                        <Image src={Immagine2} width="50" className="d-inline-block align-center logo" alt="Logo" />
                        ALPINE VISION
                    </Navbar.Brand>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto bold"onMouseEnter={OpenAllBoxes} onMouseLeave={closeAllBoxes}>
                          <div  onMouseEnter={toggleProductBox} onMouseLeave={cancelToggleBox}>
                            <Nav.Link className="bold" href="/Products" >PRODUCTS</Nav.Link>
                                {showProductBox && (
                                   <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`} >
                                    <Row>
                                      <Col md={4} className="d-flex flex-column">
                                      <p>MASCHERE</p>
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

                            <div  onMouseEnter={toggleAccessoriestBox} onMouseLeave={cancelToggleBox}>
                            <Nav.Link className="bold" href="/Accessories">ACCESSORIES</Nav.Link>
                                {showAccessoriesBox && (
                                   <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`} >

                                   <p>accessori vari.</p>
      
                                   </div>
                                )}
                            </div>

                            <div  onMouseEnter={toggleBlogBox} onMouseLeave={cancelToggleBox}>
                            <Nav.Link className="bold" href="/Blog" >BLOG</Nav.Link>
                                {showBlogBox && (
                                   <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`} >

                                   <p>blog vari.</p>
      
                                   </div>
                                )}
                            </div>

                            <div  onMouseEnter={toggleAssistanceBox} onMouseLeave={cancelToggleBox}>
                            <Nav.Link className="bold" href="/Support" >SUPPORT</Nav.Link>
                            {showAssistanceBox && (
                             <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                           <p></p>
                      
                </div>
            )}
                            </div>
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link href="#search"><Image src={SearchIcon} width="20" className="icon" alt="Search" /></Nav.Link>
                            <Nav.Link href="/Cart"><Image src={Car} width="20" className="icon" alt="Cart" /></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                {/*</Container>*/} 
            </Navbar>

            {isAnyBoxOpen && <div className={`backdrop ${isClosing ? 'closing' : 'opening'}`} onClick={closeAllBoxes}></div>
}    
        </>
    );
};

export default Header;
