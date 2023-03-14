import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button";
import "./NavLinks.css";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Skaters
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to={`/${authCtx.userId}/places`}>My Spots</NavLink>
        </li>
      )}
      {authCtx.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Spot</NavLink>
        </li>
      )}
      {!authCtx.isLoggedIn && <li>
        <NavLink to="/auth">Authenticate</NavLink>
      </li>}
      {authCtx.isLoggedIn && (
        <li>
          <Button onClick={authCtx.logout}>log out</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
