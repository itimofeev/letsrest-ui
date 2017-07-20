/*
 *
 * RequestPage reducer
 *
 */

import { fromJS } from 'immutable';
import jwtDecode from 'jwt-decode';

import {
  ADD_HEADER,
  DELETE_HEADER,
  HEADER_NAME_CHANGE,
  HEADER_VALUE_CHANGE,
  NEW_REQUEST_DIALOG,
  REQUEST_BODY_CHANGE,
  REQUEST_METHOD_CHANGE,
  REQUEST_URL_CHANGE,
  SEND_CREATE_REQUEST_SUCCESS,
  SEND_DELETE_REQUEST,
  SEND_DELETE_REQUEST_ERROR,
  SEND_DELETE_REQUEST_SUCCESS,
  SEND_EXEC_REQUEST,
  SEND_EXEC_REQUEST_ERROR,
  SEND_EXEC_REQUEST_SUCCESS,
  SEND_GET_REQUEST,
  SEND_GET_REQUEST_ERROR,
  SEND_GET_REQUEST_LIST,
  SEND_GET_REQUEST_LIST_ERROR,
  SEND_GET_REQUEST_LIST_SUCCESS,
  SEND_GET_REQUEST_SUCCESS,
  SET_AUTH_TOKEN,
} from './actions';

export const initialRequest = fromJS({
  id: '',
  name: '',
  data: {
    method: 'GET',
    headers: [],
    url: '',
    body: '',
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

  newRequestDialogOpen: false,
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
    case SEND_CREATE_REQUEST_SUCCESS:
      return setRequest(state, action.request)
        .set('newRequestDialogOpen', false);

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

    case SEND_DELETE_REQUEST:
      return state
        .set('errorRequestList', false);
    case SEND_DELETE_REQUEST_SUCCESS:
      return deleteRequest(state, action.requestId);
    case SEND_DELETE_REQUEST_ERROR:
      return deleteRequest(state, action.requestId)
        .set('errorRequestList', action.error);

    case REQUEST_METHOD_CHANGE:
      return state
        .setIn(['request', 'data', 'method'], action.method);
    case REQUEST_URL_CHANGE:
      return state
        .setIn(['request', 'data', 'url'], action.url);
    case REQUEST_BODY_CHANGE:
      return state
        .setIn(['request', 'data', 'body'], action.body);
    case DELETE_HEADER:
      return state
        .setIn(['request', 'data', 'headers'], state.getIn(['request', 'data', 'headers']).delete(action.index));
    case ADD_HEADER:
      return state
        .setIn(['request', 'data', 'headers'], state.getIn(['request', 'data', 'headers']).push(fromJS({
          name: '',
          value: '',
        })));
    case HEADER_NAME_CHANGE:
      return state
        .setIn(['request', 'data', 'headers', action.index, 'name'], action.value);
    case HEADER_VALUE_CHANGE:
      return state
        .setIn(['request', 'data', 'headers', action.index, 'value'], action.value);

    case NEW_REQUEST_DIALOG:
      return state
        .set('newRequestDialogOpen', action.open);

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

function deleteRequest(state, id) {
  const requestIndex = state.get('requestList').findIndex((item) => item.get('id') === id);
  if (requestIndex === -1) {
    return state;
  }

  return state.deleteIn(['requestList', requestIndex]).set('request', initialRequest);
}

export default requestPageReducer;
