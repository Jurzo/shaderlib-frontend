import React, { Component } from 'react';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import './App.css';
import AuthenticationService from './components/service/AuthenticationService';
import axios from 'axios';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import ShaderLibComponent from './components/ShaderLibComponent';
import ShaderList from './components/ShaderList';
import Login from './components/Login';

const API_URL = "http://localhost:8080"

class App extends Component {
  state = {
    isLoading: true,
    refreshPage: this.refreshPage,
    refresh: false,
    shaderList: [],
    refreshList: this.refreshList
  }

  refreshPage = () => {
    this.setState({
      refresh: true
    })
  }

  async componentDidMount() {
    const response = await AuthenticationService.getData('/shaders');
    const body = await response.data;
    this.setState({ shaderList: body, isLoading: false });
    if (AuthenticationService.isUserLoggedIn()) {
      AuthenticationService.reloadInterceptors();
    }
  }

  render() {
    const refreshPage = this.refreshPage;
    let { isLoading, shaderList } = this.state;

    if (isLoading) {
      return <p>Loading...</p>
    }

    const logout = () => {
      if (AuthenticationService.isUserLoggedIn()) {
        const postData = {
          requestCode: 0
        };

        const axiosConfig = AuthenticationService.getAxiosConfig();

        const url = API_URL + '/user/signout/';

        axios.post(url,
          postData,
          axiosConfig
        )
          .then(response => {
            AuthenticationService.logout();
            refreshPage();
          })
          .catch(error => {
            console.log(error);
          });
      }
    }

    return (

      <div class="parent">
        <Router>
          <div class="div1">
            <nav className="navbar">
              <Link to="/"><button className="myButton">Home</button></Link>
              <Link to="/shader/-1"><button className="myButton">New</button></Link>

              {AuthenticationService.isUserLoggedIn()
                ? <button className="myButton" onClick={logout} >Logout</button>
                : <Link to={{
                    pathname: '/login',
                    toggle: refreshPage}}>
                    <button className="myButton">Login</button></Link>}
            </nav>
          </div>
          <div class="div2">
            <Route path="/login" component={Login} />
            <Route
              exact path="/"
              render={() => <ShaderList shaderList={shaderList} />}
            />
            <Route
              path="/shader/:index"
              render={() => <ShaderLibComponent shaderList={shaderList} resolution={{ width: 800, height: 800 }} />}
            />
          </div>
        </Router>

      </div>
    );
  }
}

export default App;
