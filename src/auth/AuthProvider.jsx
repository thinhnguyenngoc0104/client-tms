import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';

const AuthProvider = ({ children }) => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
