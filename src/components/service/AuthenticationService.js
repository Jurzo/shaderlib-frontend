import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;

export const USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser'
export const USER = 'user'
export const ADMIN = 'admin'
export const AUTH1 = 'auth1'
export const AUTH2 = 'auth2'

class AuthenticationService {

    constructor(props) {
        this.registerSuccessfulLogin = this.registerSuccessfulLogin.bind(this);
    }

    executeLogin(username, password) {
        return axios.get(`${API_URL}/login/`,
            {
                headers: {
                    authorization: this.createBasicAuthToken(username, password)
                }
            }
        )
    }

    async postData(data, dest) {
        const response = axios.post(API_URL + '/post/' + dest,
            data, this.getAxiosConfig())
        return response;
    }

    async getData(url) {
        const response = axios.get(API_URL + url, this.getAxiosConfig());
        return response;
    }

    setAuthorities(authorities) {
        if (authorities.includes("USER")) {
            sessionStorage.setItem(USER, true)
        }
        if (authorities.includes("ADMIN")) {
            sessionStorage.setItem(ADMIN, true)
        }
    }

    isAdmin() {
        return sessionStorage.getItem(ADMIN);
    }

    setAuth(username, password) {
        sessionStorage.setItem(AUTH1, username)
        sessionStorage.setItem(AUTH2, password)
    }

    getAuth1() {
        return sessionStorage.getItem(AUTH1)
    }

    getAuth2() {
        return sessionStorage.getItem(AUTH2)
    }

    getAuth() {
        return {
            authorization: this.createBasicAuthToken(this.getAuth1(), this.getAuth2())
        }
    }

    getAxiosConfig() {
        return {
            headers: {
                "Content-Type": "application/json",
            },
            authorization: this.createBasicAuthToken(this.getAuth1(), this.getAuth2())
        }
    }

    createBasicAuthToken(username, password) {
        return 'Basic ' + window.btoa(username + ":" + password)
    }

    registerSuccessfulLogin(username, password) {
        sessionStorage.setItem(USER_NAME_SESSION_ATTRIBUTE_NAME, username)
        this.setupAxiosInterceptors(this.createBasicAuthToken(username, password))
        this.setAuth(username, password)
    }

    logout() {
        sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        sessionStorage.removeItem(AUTH1);
        sessionStorage.removeItem(AUTH2);
        sessionStorage.removeItem(ADMIN);
    }

    isUserLoggedIn() {
        const user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        if (user === null) {
            return false
        } else {
            return true
        }
    }

    getLoggedInUserName() {
        const user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if (user === null) {
            return ''
        } else {
            return user
        }
    }

    reloadInterceptors() {
        const username = this.getAuth1();
        const password = this.getAuth2();
        this.executeLogin(username, password)
            .then(response => {
                this.registerSuccessfulLogin(username, password);
                this.setAuthorities(response.data.authorities);
            })
            .catch(error => {
                console.log(error)
            });
    }

    setupAxiosInterceptors(token) {
        axios.interceptors.request.use(
            (config) => {
                if (this.isUserLoggedIn()) {
                    config.headers.authorization = token
                }
                return config
            }
        )
    }
}

export default new AuthenticationService()