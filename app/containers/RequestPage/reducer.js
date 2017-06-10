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
  errorExecRequest: false,
  loadingExecRequest: false,
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
