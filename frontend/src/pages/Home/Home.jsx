import React from "react";
import "./Home.css";
import { Tumblr } from "./Tumblr";
import {Video} from  './Video.jsx';
import {Aura} from './Aura';
import {Products} from './Products.jsx';
import {Pollution} from './Pollution.jsx';

export const Home = ()=>  {
  return (
    <div className="App" style={{ height: "auto" }}>
      <Video />
      <Aura /> 
      <Tumblr />
      <Products />
      <Pollution />
    </div>
  );
}
