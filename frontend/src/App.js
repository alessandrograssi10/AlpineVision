import './App.css';
import React, { Component, useEffect } from 'react';
import { verifyTokenAndUserId } from './assets/Scripts/GetUserInfo.js';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Importa le pagine
import { Home } from './pages/Home/Home.jsx';
import { Products } from './pages/Products/Products.jsx';
import { Accessories } from './pages/Accessories/Accessories.jsx';
import { Blog } from './pages/Blog/Blog.jsx';
import { BlogEdit } from './pages/Blog/BlogEditor/BlogEdit.jsx';
import { BlogArticle } from './pages/Blog/BlogArticle.jsx';
import { BlogArticleEdit } from './pages/Blog/BlogEditor/BlogArticleEdit.jsx';
import { Search } from './pages/Search/Search.jsx';
import { Editor } from './pages/Editor/Editor.jsx';
import Payments from './pages/Payments/Payments.jsx';
import AboutUs from './pages/About_Us/AboutUs.jsx';
import PersonalArea from './pages/AreaPersonale/PersonalArea.jsx';
import Cart from './pages/Cart/Cart.jsx';
import { Product } from './pages/Products/Product.jsx';
import { Accessory } from './pages/Accessories/Accessory.jsx';
import Header from './components/Header/header.js';
import Footer from './components/Footer/Footer.js';
import Login_Signin from './pages/Login_SignUp/Login_Signin';
import Confirm from './pages/Payments/ConfirmPayment.jsx';

// Funzione per tornare in cima alla pagina quando si cambia pagina
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

class App extends Component {
  componentDidMount() {
    verifyTokenAndUserId(); // Verifica se il token e l'ID utente sono validi
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blogEdit" element={<BlogEdit />} />
            <Route path="/search" element={<Search />} />
            <Route path="/BlogArticle/:id" element={<BlogArticle />} />
            <Route path="/BlogArticleEdit/:id" element={<BlogArticleEdit />} />
            <Route path="/AreaPersonale" element={<PersonalArea />} />
            <Route path="/Payments/:id" element={<Payments />} />
            <Route path="/Support" element={<AboutUs />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/accessory/:id" element={<Accessory />} />
            <Route path="/login" element={<Login_Signin />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/confermpay" element={<Confirm />} />
          </Routes>
          <Footer />
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
