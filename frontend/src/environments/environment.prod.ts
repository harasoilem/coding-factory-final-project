export const environment = {
  production: true,
  environment: 'production',
  virtualHost: window['env']['virtualHost'] || 'site.localhost',
  http: window['env']['http'] || 'http',
  apiUrl:  (window['env']['backendUrl'] || 'localhost:8000') + '/api/v1',
  authUrl:  (window['env']['backendUrl'] || 'localhost:8000') + '/auth',
};
