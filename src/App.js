import React, { Component } from 'react';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import './App.css';
import AuthenticationService from './components/service/AuthenticationService';
import axios from 'axios';
import { BrowserRouter as Router, Route } from "react-router-dom";

import ShaderLibComponent from './components/ShaderLibComponent';
import ShaderList from './components/ShaderList';
import Login from './components/Login';
import Navbar from './components/Navbar';

require('dotenv').config();

class App extends Component {
  state = {
    isLoading: true,
    refreshPage: this.refreshPage,
    refresh: false,
    shaderList: [],
    refreshList: this.refreshList
  }

  refreshPage = () => {
    AuthenticationService.getData('/shaders')
      .then(resp => resp.data)
      .then(data => {
        this.setState({
          refresh: true,
          shaderList: data
        })
        console.log(data);
      })
  }

  async componentDidMount() {
    const response = await AuthenticationService.getData('/shaders');
    const body = await response.data;
    console.log(body);
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

        const url = process.env.REACT_APP_API_URL + '/user/signout/';

        axios.post(url,
          postData,
          axiosConfig
        )
          .then(_ => {
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
            <Navbar logout={logout} refreshPage={refreshPage} />
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
