import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import apis from './auth-request-api';

const AuthContext = createContext();
console.log(`create AuthContext: ${AuthContext}`);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: 'GET_LOGGED_IN',
  LOGIN_USER: 'LOGIN_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  REGISTER_USER: 'REGISTER_USER',
};

function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
  });
  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
        });
      }
      case AuthActionType.REGISTER_USER:
      case AuthActionType.LOGIN_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
        });
      }
      case AuthActionType.LOGOUT_USER: {
        return setAuth({
          user: null,
          loggedIn: false,
        });
      }
      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function getLoggedIn() {
    const response = await apis.getLoggedIn();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.GET_LOGGED_IN,
        payload: {
          loggedIn: response.data.loggedIn,
          user: response.data.user,
        },
      });
    }
  };

  auth.registerUser = async function registerUser(
    firstName,
    lastName,
    email,
    password,
    passwordVerify,
  ) {
    const response = await apis.registerUser(
      firstName,
      lastName,
      email,
      password,
      passwordVerify,
    );
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.REGISTER_USER,
        payload: {
          user: response.data.user,
        },
      });
      history.push('/');
    }
  };

  auth.loginUser = async function loginUser(email, password) {
    const response = await apis.loginUser(email, password);
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGIN_USER,
        payload: {
          user: response.data.user,
        },
      });
      history.push('/');
    }
  };

  auth.logoutUser = async function logoutUser() {
    const response = await apis.logoutUser();
    if (response.status === 200) {
      authReducer({
        type: AuthActionType.LOGOUT_USER,
        payload: null,
      });
      history.push('/');
    }
  };

  auth.getUserInitials = function getUserInitials() {
    let initials = '';
    if (auth.user) {
      initials += auth.user.firstName.charAt(0);
      initials += auth.user.lastName.charAt(0);
    }
    console.log(`user initials: ${initials}`);
    return initials;
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ auth }}>
      {children}
    </AuthContext.Provider>
  );
}
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
export { AuthContextProvider };
