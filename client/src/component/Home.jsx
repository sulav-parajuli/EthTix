import React from "react";
import Main from "./Main";
import MainEvent from "./MainEvent";
import MainAbout from "./MainAbout";
import Feature from "./Feature";
import FAQs from "./FAQs";
import "../assets/css/Main.css";

const Home = () => {
  return (
    <div className="mcontainer" id="home">
      <Main />
      <MainEvent />
      <MainAbout />
      <Feature />
      <FAQs />
    </div>
  );
};
export default Home;
