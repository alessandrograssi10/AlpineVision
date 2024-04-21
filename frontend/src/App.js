import logo from './assets/Images/logo.svg';
import './App.css';
import React, { Component , useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home.jsx';
import { Products } from './pages/Products/Products.jsx';
import { Accessories } from './pages/Accessories/Accessories.jsx';
import { Blog } from './pages/Blog/Blog.jsx';
import { BlogEdit } from './pages/Blog/BlogEditor/BlogEdit.jsx';
import {BlogArticle} from './pages/Blog/BlogArticle.jsx';
import {BlogArticleEdit} from './pages/Blog/BlogEditor/BlogArticleEdit.jsx';
import {Search} from './pages/Search/Search.jsx';

import { Support } from './pages/Support/Support.jsx';
import { Cart } from './pages/Cart/Cart.jsx'
import { Product } from './pages/Products/Product.jsx'
import Header from './components/Header/header.js';
import Footer from './components/Footer/Footer.js';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login_Signin from './pages/Login_SignUp/Login_Signin';

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
          <Route exact path ="/home" Component={Home}/>
          <Route exact path ="/products" Component={Products}/>
          <Route exact path ="/accessories" Component={Accessories}/>
          <Route exact path ="/blog" Component={Blog}/>
          <Route exact path ="/blogEdit" Component={BlogEdit}/>
          <Route exact path ="/search" Component={Search}/>

          <Route path="/BlogArticle/:id" element={<BlogArticle/>} />
          <Route path="/BlogArticleEdit/:id" element={<BlogArticleEdit/>} />

          <Route exact path ="/support" Component={Support}/>
          <Route exact path ="/cart" Component={Cart}/>
          <Route exact path ="/product/:id" element={<Product/>}/>
          <Route exact path="/login" Component={Login_Signin}/>

          </Routes>

      <Footer/>
      </Router>

    </React.Fragment>
  );
  }
}

export default App;
