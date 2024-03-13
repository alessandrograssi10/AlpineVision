import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Image, Collapse } from 'react-bootstrap';
import Immagine2 from '../../assets/Images/Asset 1.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';
import User from '../../assets/Images/user.png';
import Burger from '../../assets/Images/burger-bar.png';
import NavDropdown from 'react-bootstrap/NavDropdown';

import './Header.css';

export const Header = () => {
    const [showPanel, setShowPanel] = useState(false); // Stato per gestire la visibilità del pannello
   

    return (
        <>
        <Navbar expand="lg" className="bg-body-tertiary navbar">
                <Container>
      <Navbar.Brand href="#home">
          <Image
            src={Immagine2} // Cambia questo con il percorso del tuo logo
            width="50" // Adegua queste dimensioni al tuo logo
            style={{ verticalAlign: 'middle', marginRight: '10px' }} // Aggiunge un allineamento verticale e un margine a destra
            className="d-inline-block align-center"
            alt="Logo"
          />{' '}
          React-Bootstrap
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home"onClick={() => setShowPanel(!showPanel)}>Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link href="#about">About Us</Nav.Link> 
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
    );
};

export default Header;
