import React from "react";
import Main from "./Main";
import MainEvent from "./MainEvent";
import MainAbout from "./MainAbout";
import Feature from "./Feature";
import FAQs from "./FAQs";
import "../assets/css/Main.css";

const Home = ({ state }) => {
  return (
    <div>
      <Main state={state} />
      <MainEvent />
      <MainAbout />
      <Feature />
      <FAQs />
    </div>
  );
};
export default Home;
