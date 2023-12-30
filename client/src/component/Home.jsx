import React, { useEffect } from "react";
import Main from "./Main";
import MainEvent from "./MainEvent";
import MainAbout from "./MainAbout";
import Feature from "./Feature";
import FAQs from "./FAQs";
import "../assets/css/Main.css";

const Home = ({ state }) => {
  useEffect(() => {
    document.querySelector(".topnav").style.display = "flex";
    document.querySelector(".footer-container").style.display = "block";
  }, []);
  return (
    <div className="mcontainer">
      <Main state={state} />
      <MainEvent />
      <MainAbout />
      <Feature />
      <FAQs />
    </div>
  );
};
export default Home;
