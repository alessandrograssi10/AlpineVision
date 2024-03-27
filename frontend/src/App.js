import logo from './assets/Images/logo.svg';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home';
import Header from './components/comHome/header';
import Footer from './components/Footer';

class App extends Component {
  render(){
  return (
    <React.Fragment>
      <Header/>
      <Router>
        <Routes>
          <Route exact path ="/" Component={Home}/>
          <Route exact path ="/Home" Component={Home}/>

        </Routes>
      </Router>
      <Footer/>
    </React.Fragment>
  );
  }
}

export default App;
