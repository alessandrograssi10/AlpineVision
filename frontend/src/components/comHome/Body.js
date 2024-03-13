import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Image, Collapse } from 'react-bootstrap';
import Immagine2 from '../../assets/Images/Asset 1.png';
import SearchIcon from '../../assets/Images/Sicon.png';
import Car from '../../assets/Images/shopping-cart.png';
import User from '../../assets/Images/user.png';
import './Header.css';
import Immagine from '../../assets/Images/bot2_sunglasses.jpg';

export const Body = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
 <div className = 'prova'>
 "Why do skiers always wear masks? Because without them, they would go down in their faces!"
        </div>
            <Image src={Immagine} fluid />
            <Image src={Immagine} fluid />
            <Image src={Immagine} fluid />
           <Image src={Immagine} fluid />
        </>
    );
};

export default Body;
