import React from "react";
import Main from "./Main";
import Clients from "./Clients";
import MainEvent from "./MainEvent";
import MainAbout from "./MainAbout";
import Feature from "./Feature";
import FAQs from "./FAQs";
import WhyEthTix from "./WhyEthTix";
import HowToUse from "./HowToUse";
import "../assets/css/Main.css";

const Home = ({ state }) => {
  return (
    <div>
      <Main state={state} />
      <Clients />
      <MainEvent />
      <MainAbout />
      <WhyEthTix />
      <Feature />
      <HowToUse />
      <FAQs />
    </div>
  );
};
export default Home;
