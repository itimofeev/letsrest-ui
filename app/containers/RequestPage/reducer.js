/*
 *
 * RequestPage reducer
 *
 */

import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';

import {
  SEND_EXEC_REQUEST,
  SEND_EXEC_REQUEST_SUCCESS,
  SEND_EXEC_REQUEST_ERROR,
  REQUEST_CREATE_SUCCESS,
  SET_AUTH_TOKEN,
  REQUEST_METHOD_CHANGE,
  REQUEST_URL_CHANGE,
  SEND_GET_REQUEST_LIST,
  SEND_GET_REQUEST_LIST_SUCCESS,
  SEND_GET_REQUEST_LIST_ERROR,
  SEND_GET_REQUEST,
  SEND_GET_REQUEST_ERROR,
  SEND_GET_REQUEST_SUCCESS,
  NEW_REQUEST,
} from './actions';

const initialRequest = fromJS({
  id: '',
  name: '',
  data: {
    method: 'GET',
    url: '',
  },
  status: {
    status: '',
    error: '',
  },
});

// The initial state of the App
const initialState = fromJS({
  request: initialRequest,
  authToken: '',
  requestList: [],
  errorExecRequest: false,
  loadingExecRequest: false,
  user: false,

  errorRequestList: false,
  loadingRequestList: false,
});

function requestPageReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_EXEC_REQUEST:
      return state
        .set('errorExecRequest', false)
        .set('loadingExecRequest', true);
    case SEND_EXEC_REQUEST_ERROR:
      return state
        .set('errorExecRequest', action.error)
        .set('loadingExecRequest', false);
    case SEND_EXEC_REQUEST_SUCCESS:
      return setRequest(state, action.request);
    case REQUEST_CREATE_SUCCESS:
      return state
        .set('request', action.request);

    case SET_AUTH_TOKEN:
      return state.set('authToken', action.authToken)
        .set('user', fromJS({ id: jwtDecode(action.authToken).user_id }));

    case SEND_GET_REQUEST:
      return state
        .set('errorExecRequest', false)
        .set('loadingExecRequest', true);
    case SEND_GET_REQUEST_ERROR:
      return state
        .set('errorExecRequest', action.error)
        .set('loadingExecRequest', false);
    case SEND_GET_REQUEST_SUCCESS:
      return state
        .set('request', action.request)
        .set('errorExecRequest', false)
        .set('loadingExecRequest', false);

    case SEND_GET_REQUEST_LIST:
      return state
        .set('errorRequestList', false)
        .set('loadingRequestList', true);
    case SEND_GET_REQUEST_LIST_ERROR:
      return state
        .set('errorRequestList', action.error)
        .set('loadingRequestList', false);
    case SEND_GET_REQUEST_LIST_SUCCESS:
      return state
        .set('requestList', action.requestList)
        .set('loadingRequestList', false);

    case REQUEST_METHOD_CHANGE:
      return state
        .setIn(['request', 'data', 'method'], action.method);
    case REQUEST_URL_CHANGE:
      return state
        .setIn(['request', 'data', 'url'], action.url);

    case NEW_REQUEST:
      return state
        .set('request', initialRequest);

    default:
      return state;
  }
}

function setRequest(state, request) {
  const newState = state
    .set('request', request)
    .set('errorExecRequest', false)
    .set('loadingExecRequest', false);

  const requestIndex = state.get('requestList').findIndex((item) => item.get('id') === request.get('id'));

  if (requestIndex === -1) {
    return newState.update('requestList', (requestList) => requestList.push(request));
  }
  return newState.setIn(['requestList', requestIndex], request);
}

export default requestPageReducer;
