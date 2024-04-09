import logo from './assets/Images/logo.svg';

import './App.css';
import React, { Component , useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { Products } from './pages/Products/Products.jsx';
import { Accessories } from './pages/Accessories/Accessories.jsx';
import { Blog } from './pages/Blog/Blog.jsx';
import BlogArticle from './pages/Blog/BlogArticle.jsx';

import { Support } from './pages/Support/Support.jsx';
import { Cart } from './pages/Cart/Cart.jsx'
import { EternalAura } from './pages/Products/EternalAura/EternalAura.js'

import Header from './components/Header/header.js';
import Footer from './components/Footer/Footer.js';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
 
class App extends Component {
  // Inizializzazione dello stato
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      
    };
  }

  // Effettua una chiamata al backend quando il componente viene montato
  componentDidMount() {
    axios.get('http://localhost:3020/nomi')
      .then(response => {
        this.setState({ message: response.data });
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  }
  render(){
  return (
    <React.Fragment>
      <Router>
      <ScrollToTop />
      <Header/>
      <p>
      <p>First communication with Mars: {JSON.stringify(this.state.message, null, 2)}</p>
        </p>
      <Routes>
          <Route exact path ="/" Component={Home}/>
          <Route exact path ="/Home" Component={Home}/>
          <Route exact path ="/Products" Component={Products}/>
          <Route exact path ="/Accessories" Component={Accessories}/>
          <Route exact path ="/Blog" Component={Blog}/>
          <Route  path="/BlogArticle/:id" component={BlogArticle} />

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
