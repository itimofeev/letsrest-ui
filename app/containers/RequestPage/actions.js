/*
 *
 * RequestPage actions
 *
 */

export const SEND_EXEC_REQUEST = 'app/RequestPage/SEND_EXEC_REQUEST';
export const SEND_EXEC_REQUEST_SUCCESS = 'app/RequestPage/SEND_EXEC_REQUEST_SUCCESS';
export const SEND_EXEC_REQUEST_ERROR = 'app/RequestPage/SEND_EXEC_REQUEST_ERROR';

export const REQUEST_CREATE_SUCCESS = 'app/RequestPage/REQUEST_CREATE_SUCCESS';
export const CANCEL_EXEC_REQUEST = 'app/RequestPage/CANCEL_EXEC_REQUEST';

export const SEND_GET_REQUEST_LIST = 'app/RequestPage/SEND_GET_REQUEST_LIST';
export const SEND_GET_REQUEST_LIST_SUCCESS = 'app/RequestPage/SEND_GET_REQUEST_LIST_SUCCESS';
export const SEND_GET_REQUEST_LIST_ERROR = 'app/RequestPage/SEND_GET_REQUEST_LIST_ERROR';

export const SEND_COPY_REQUEST = 'app/RequestPage/SEND_COPY_REQUEST';

export const SEND_GET_REQUEST = 'app/RequestPage/SEND_GET_REQUEST';
export const SEND_GET_REQUEST_SUCCESS = 'app/RequestPage/SEND_GET_REQUEST_SUCCESS';
export const SEND_GET_REQUEST_ERROR = 'app/RequestPage/SEND_GET_REQUEST_ERROR';

export const SEND_DELETE_REQUEST = 'app/RequestPage/SEND_DELETE_REQUEST';
export const SEND_DELETE_REQUEST_SUCCESS = 'app/RequestPage/SEND_DELETE_REQUEST_SUCCESS';
export const SEND_DELETE_REQUEST_ERROR = 'app/RequestPage/SEND_DELETE_REQUEST_ERROR';

export const REQUEST_METHOD_CHANGE = 'app/RequestPage/REQUEST_METHOD_CHANGE';
export const REQUEST_URL_CHANGE = 'app/RequestPage/REQUEST_URL_CHANGE';
export const REQUEST_BODY_CHANGE = 'app/RequestPage/REQUEST_BODY_CHANGE';
export const DELETE_HEADER = 'app/RequestPage/DELETE_HEADER';
export const ADD_HEADER = 'app/RequestPage/ADD_HEADER';
export const HEADER_NAME_CHANGE = 'app/RequestPage/HEADER_NAME_CHANGE';
export const HEADER_VALUE_CHANGE = 'app/RequestPage/HEADER_VALUE_CHANGE';

export const LOAD_AUTH_TOKEN = 'app/App/LOAD_AUTH_TOKEN';
export const SET_AUTH_TOKEN = 'app/App/SET_AUTH_TOKEN';

export const NEW_REQUEST = 'app/App/NEW_REQUEST';

export function loadAuthToken() {
  return {
    type: LOAD_AUTH_TOKEN,
  };
}

export function setAuthToken(authToken) {
  return {
    type: SET_AUTH_TOKEN,
    authToken,
  };
}

export function requestCreateSuccess(request) {
  return {
    type: REQUEST_CREATE_SUCCESS,
    request,
  };
}

export function sendExecRequest() {
  return {
    type: SEND_EXEC_REQUEST,
  };
}

export function sendExecRequestSuccess(request) {
  return {
    type: SEND_EXEC_REQUEST_SUCCESS,
    request,
  };
}

export function sendExecRequestError(error) {
  return {
    type: SEND_EXEC_REQUEST_ERROR,
    error,
  };
}

export function cancelExecRequest() {
  return {
    type: CANCEL_EXEC_REQUEST,
  };
}

export function sendGetRequestList() {
  return {
    type: SEND_GET_REQUEST_LIST,
  };
}

export function sendGetRequestListSuccess(requestList) {
  return {
    type: SEND_GET_REQUEST_LIST_SUCCESS,
    requestList,
  };
}

export function sendGetRequestListError(error) {
  return {
    type: SEND_GET_REQUEST_LIST_ERROR,
    error,
  };
}

export function sendGetRequest(requestId) {
  return {
    type: SEND_GET_REQUEST,
    requestId,
  };
}

export function sendGetRequestSuccess(request) {
  return {
    type: SEND_GET_REQUEST_SUCCESS,
    request,
  };
}

export function sendGetRequestError(error) {
  return {
    type: SEND_GET_REQUEST_ERROR,
    error,
  };
}

export function sendCopyRequest() {
  return {
    type: SEND_COPY_REQUEST,
  };
}

export function requestMethodChange(method) {
  return {
    type: REQUEST_METHOD_CHANGE,
    method,
  };
}

export function requestUrlChange(url) {
  return {
    type: REQUEST_URL_CHANGE,
    url,
  };
}

export function requestBodyChange(body) {
  return {
    type: REQUEST_BODY_CHANGE,
    body,
  };
}

export function deleteHeader(index) {
  return {
    type: DELETE_HEADER,
    index,
  };
}

export function addHeader() {
  return {
    type: ADD_HEADER,
  };
}

export function headerNameChange(index, value) {
  return {
    type: HEADER_NAME_CHANGE,
    index,
    value,
  };
}

export function headerValueChange(index, value) {
  return {
    type: HEADER_VALUE_CHANGE,
    index,
    value,
  };
}

export function sendDeleteRequest(requestId) {
  return {
    type: SEND_DELETE_REQUEST,
    requestId,
  };
}

export function sendDeleteRequestSuccess(requestId) {
  return {
    type: SEND_DELETE_REQUEST_SUCCESS,
    requestId,
  };
}

export function sendDeleteRequestError(error) {
  return {
    type: SEND_DELETE_REQUEST_ERROR,
    error,
  };
}

export function openNewRequest() {
  return {
    type: NEW_REQUEST,
  };
}

