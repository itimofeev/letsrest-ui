/*
 *
 * RequestPage reducer
 *
 */

import { fromJS } from 'immutable';
import {
  EXEC_REQUEST,
} from './actions';

const initialState = fromJS({});

function requestPageReducer(state = initialState, action) {
  switch (action.type) {
    case EXEC_REQUEST:
      return state;
    default:
      return state;
  }
}

export default requestPageReducer;
