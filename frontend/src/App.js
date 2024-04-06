import logo from './assets/Images/logo.svg';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { Products } from './pages/Products/Products.jsx';
import { Accessories } from './pages/Accessories/Accessories.jsx';
import { Blog } from './pages/Blog/Blog.jsx';
import { Support } from './pages/Support/Support.jsx';
import { Cart } from './pages/Cart/Cart.jsx'
import { EternalAura } from './pages/Products/EternalAura/EternalAura.js'

import Header from './components/Header/header.js';
import Footer from './components/Footer/Footer.js';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
 
class App extends Component {
  render(){
  return (
    <React.Fragment>
      <Router>
      <ScrollToTop />
      <Header/>
      
      <Routes>
          <Route exact path ="/" Component={Home}/>
          <Route exact path ="/Home" Component={Home}/>
          <Route exact path ="/Products" Component={Products}/>
          <Route exact path ="/Accessories" Component={Accessories}/>
          <Route exact path ="/Blog" Component={Blog}/>
          <Route exact path ="/Support" Component={Support}/>
          <Route exact path ="/Cart" Component={Cart}/>
          <Route exact path ="/EternalAura" Component={EternalAura}/>

          </Routes>

      <Footer/>
      </Router>

    </React.Fragment>
  );
  }
}

export default App;
