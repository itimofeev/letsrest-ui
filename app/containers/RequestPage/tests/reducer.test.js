
import { fromJS } from 'immutable';
import requestPageReducer from '../reducer';

describe('requestPageReducer', () => {
  it('returns the initial state', () => {
    expect(requestPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
