import {JwtHelperService} from '@auth0/angular-jwt';

export interface Token {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  tokens: Token;
  username: string;
  tenant: string;
}

export interface APIResponse<T> {
  data: T;
  error: Error;
}

export interface Error {
  message: string;
  code: number;
}

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function setAccessToken(token: string) {
  return localStorage.setItem('access_token', token);
}

export function removeAccessToken() {
  return localStorage.removeItem('access_token');
}

export function isTokenExpired() {
  const helper = new JwtHelperService();
  const token = getAccessToken();
  return !token || helper.isTokenExpired(token);
}
