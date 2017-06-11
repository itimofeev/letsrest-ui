/**
 * Created by ilya.timofeev on 04/10/16.
 */


export function storeAuthToken(authToken) {
  localStorage.setItem('authToken', authToken);
}

export function removeAuthToken() {
  localStorage.removeItem('authToken');
}

export function getAuthTokenOrNull() {
  return localStorage.getItem('authToken');
}
