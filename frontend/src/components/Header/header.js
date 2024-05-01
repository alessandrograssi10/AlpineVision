import React, { useState, useEffect } from 'react';
import {Navbar, Nav, Image, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Immagine2 from '../../assets/Images/Asset 1.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';
import Skier from '../../assets/Images/skier.png';
import './Header.css';
import HeaderProducts from './header_products';
import AuthServices from '../../pages/Login_SignUp/AuthService';


export const Header = () => {
    const [currentBox, setCurrentBox] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isOpening, setIsOpening] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
    useEffect(() => {
        const handleResize = () => { setIsLargeScreen(window.innerWidth >= 992); };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); };
    }, []);

    const handleLinkClick = () => {
        closeAllBoxes();
    };

    const cancelToggleBox = () => {
        if (!isLargeScreen) return;
        clearTimeout(timeoutId);
    };

    const toggleBox = (boxName) => {
        if (!isLargeScreen) return;
        cancelToggleBox();
        if (currentBox !== boxName) {
            if (currentBox === 'showSearchBox') OpenAllBoxes();
            const id = setTimeout(() => {
                setCurrentBox(boxName);
            }, 100);
            setTimeoutId(id);
        } else {
            if (currentBox === 'showSearchBox') closeAllBoxes();
        }
    };

    const OpenAllBoxes = () => {
        if (!isLargeScreen || currentBox) return;
        setIsOpening(true);
        setTimeout(() => { setIsOpening(false); }, 200);
    };

    const closeAllBoxes = () => {
        console.log("val", currentBox);
        if (!isLargeScreen || !currentBox) return;
        setIsClosing(true);
        setTimeout(() => {
            setCurrentBox(null);
            setIsClosing(false);
        }, 200);
    };

    const handleSearchChange = (event) => { setSearchTerm(event.target.value); };

    const handleLoginClick = ()=>{

        if(AuthServices.isLoggedIn()){
            window.location.href("/areapersonale")
        }else{
            window.location.href("/login")
        }
    }
    return (
        <>
            <Navbar id="top" expand="lg" className="custom-navbar" onMouseLeave={closeAllBoxes} >
                <Navbar.Brand as={Link} to="/home" className="navbar-brand-bold">
                    <Image src={Immagine2} width="50" className="d-inline-block align-center logo" alt="Logo" />
                    ALPINE VISION
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav to="/Blog" className="me-auto" onMouseEnter={OpenAllBoxes} onMouseLeave={closeAllBoxes}>
                        <div onMouseEnter={() => toggleBox("showProductBox")} onMouseLeave={cancelToggleBox}>
                            <Nav.Link as={Link} to="/products" onClick={() => handleLinkClick('Products')} className={`bold ${currentBox === 'showProductBox' ? 'hovered' : ''}`}>PRODOTTI</Nav.Link>
                            {currentBox === 'showProductBox' && (
                                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                    <HeaderProducts onCloseAllBoxes={closeAllBoxes} />
                                </div>
                            )}
                        </div>

                        <div onMouseEnter={() => toggleBox("showAccessoriesBox")} onMouseLeave={cancelToggleBox}>
                            <Nav.Link as={Link} to="/accessories" onClick={() => handleLinkClick('Accessories')} className={`bold ${currentBox === 'showAccessoriesBox' ? 'hovered' : ''}`}>ACCESSORI</Nav.Link>
                            {currentBox === 'showAccessoriesBox' && (
                                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                    <p>accessori vari.</p>
                                </div>
                            )}
                        </div>

                        <div onMouseEnter={() => toggleBox('showBlogBox')} onMouseLeave={cancelToggleBox}>
                            <Nav.Link as={Link} to="/blog" onClick={() => handleLinkClick('Blog')} className={`bold ${currentBox === 'showBlogBox' ? 'hovered' : ''}`}>BLOG</Nav.Link>
                            {currentBox === 'showBlogBox' && (
                                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                    <p>blog vari.</p>
                                </div>
                            )}
                        </div>

                        <div onMouseEnter={() => toggleBox('showAboutUs')} onMouseLeave={cancelToggleBox}>
                            <Nav.Link as={Link} to="/support" onClick={() => handleLinkClick('Support')} className={`bold ${currentBox === 'showAboutUs' ? 'hovered' : ''}`}>CHI SIAMO</Nav.Link>
                            {currentBox === 'showAboutUs' && (
                                <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
                                    <p>At Alpine Vision, we believe that every adventure is an opportunity for discovery and growth. Whether you're conquering mountain peaks, traversing rugged trails, or simply soaking in the beauty of nature, we're here to support you every step of the way.</p>
                                </div>
                            )}
                        </div>
                    </Nav>
                    <Nav className="ms-auto" >
                        <Nav>
                            <div >
                                <Nav.Link as={Link} className={`bold ${currentBox === 'showSearchBox' ? 'hovered' : ''}`}>
                                  <Image onClick={() => toggleBox("showSearchBox")} src={SearchIcon} width="20" className="icon d-none d-lg-inline-block d-xl-inline-block" alt="Search" />
                                  <span className="d-inline-block d-lg-none d-xl-none align-center logo">Cerca</span>
                                </Nav.Link>
                                {currentBox === 'showSearchBox' && (
                                    <div className={`info-box ${isClosing ? 'closing' : isOpening ? 'opening' : ''}`}>
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
                        <Nav.Link onMouseEnter={closeAllBoxes} href="/cart">
                          
                          <Image src={Car} width="20" className="icon d-none d-lg-inline-block d-xl-inline-block" alt="Cart" />
                          <span className="d-inline-block d-lg-none d-xl-none align-center logo">Carrello</span>

                        </Nav.Link>
                        <Nav.Link onMouseEnter={closeAllBoxes} onClick={() => handleLoginClick()}>
                          <Image src={Skier} width="20" className="icon d-none d-lg-inline-block d-xl-inline-block" alt="Login" />
                          <span className="d-inline-block d-lg-none d-xl-none align-center logo">login</span>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {(currentBox || isClosing) && <div className={`backdrop ${isClosing ? 'closing' : 'opening'}`} onClick={closeAllBoxes}></div>}
        </>
    );
};

export default Header;
