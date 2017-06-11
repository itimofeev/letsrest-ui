/*
 *
 * RequestPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SEND_EXEC_REQUEST,
  SEND_EXEC_REQUEST_SUCCESS,
  SEND_EXEC_REQUEST_ERROR,

  REQUEST_METHOD_CHANGE,
  REQUEST_URL_CHANGE,

  SEND_GET_REQUEST_LIST,
  SEND_GET_REQUEST_LIST_SUCCESS,
  SEND_GET_REQUEST_LIST_ERROR,
} from './actions';

// The initial state of the App
const initialState = fromJS({
  request: {
    id: '',
    name: '',
    data: {
      method: 'GET',
      url: '',
    },
  },
  requestList: [],
  errorExecRequest: false,
  loadingExecRequest: false,

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
      return state
        .set('request', action.request)
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
    default:
      return state;
  }
}

export default requestPageReducer;
