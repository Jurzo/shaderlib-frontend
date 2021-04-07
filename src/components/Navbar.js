import AuthenticationService from './service/AuthenticationService';
import { Link } from "react-router-dom";
import { useState } from 'react';


function Navbar(props) {
  return (
    <nav className="navbar">
      <Link to="/"><button className="myButton" onClick={props.refreshPage}>Home</button></Link>
      <Link to="/shader/-1">
        <button className="myButton">New</button>
      </Link>

      {AuthenticationService.isUserLoggedIn()
        ? <Link to={{
          pathname: '/'
        }}><button className="myButton" onClick={props.logout} >Logout</button></Link>
        : <Link to={{
          pathname: '/login',
          toggle: props.refreshPage
        }}>
        <button className="myButton">Login</button></Link>}
    </nav>
  );

}

export default Navbar;