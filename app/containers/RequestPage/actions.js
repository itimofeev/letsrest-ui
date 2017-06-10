/*
 *
 * RequestPage actions
 *
 */

export const SEND_EXEC_REQUEST = 'app/RequestPage/SEND_EXEC_REQUEST';
export const SEND_EXEC_REQUEST_SUCCESS = 'app/RequestPage/SEND_EXEC_REQUEST_SUCCESS';
export const SEND_EXEC_REQUEST_ERROR = 'app/RequestPage/SEND_EXEC_REQUEST_ERROR';

export const SEND_REQUEST_LIST = 'app/RequestPage/SEND_REQUEST_LIST';
export const SEND_REQUEST_LIST_SUCCESS = 'app/RequestPage/SEND_REQUEST_LIST_SUCCESS';
export const SEND_REQUEST_LIST_ERROR = 'app/RequestPage/SEND_REQUEST_LIST_ERROR';

export const REQUEST_METHOD_CHANGE = 'app/RequestPage/REQUEST_METHOD_CHANGE';
export const REQUEST_URL_CHANGE = 'app/RequestPage/REQUEST_URL_CHANGE';


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

export function sendRequestList() {
  return {
    type: SEND_REQUEST_LIST,
  };
}

export function sendRequestListSuccess(requestList) {
  return {
    type: SEND_REQUEST_LIST_SUCCESS,
    requestList,
  };
}

export function sendRequestListError(error) {
  return {
    type: SEND_REQUEST_LIST_ERROR,
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

