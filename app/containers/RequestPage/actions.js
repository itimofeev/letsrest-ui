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

export const REQUEST_METHOD_CHANGE = 'app/RequestPage/REQUEST_METHOD_CHANGE';
export const REQUEST_URL_CHANGE = 'app/RequestPage/REQUEST_URL_CHANGE';


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

