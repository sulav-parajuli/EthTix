import BrowseEvent from "./BrowseEvent";
import Home from "./Home";
import Login from "./Login";
import { Link } from "react-router-dom";

//Navbar containaing home , Events, about us and login button
const Navbar = ({ state }) => {
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-light fixed-top mb-5">
        <div class="container-fluid">
          <a class="navbar-brand ms-5" href="./">
            EthTix
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item ms-5">
                <Link to="/" class="nav-link active" aria-current="page">
                  Home
                </Link>
              </li>
              <li class="nav-item ms-5">
                <Link to="/BrowseEvent" class="nav-link active">
                  Browse Event
                </Link>
              </li>
            </ul>

            <div>
              <Login state={state} />:
              <button className="btn btn-outline-success">Connect</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
