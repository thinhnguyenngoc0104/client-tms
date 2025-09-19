// Auth0 configuration
export const auth0Config = {
  domain: import.meta.env.REACT_APP_AUTH0_DOMAIN || 'dev-lkz2wcgwo6lpx8r8.us.auth0.com',
  clientId: import.meta.env.REACT_APP_AUTH0_CLIENT_ID || 'OXrubMllBqPDTMse1LPWmLJdkcZOFPJI',
  redirectUri: window.location.origin,
  audience: import.meta.env.REACT_APP_AUTH0_AUDIENCE || 'https://tms-api',
  scope: 'openid profile email'
};
