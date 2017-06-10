import { createSelector } from 'reselect';

/**
 * Direct selector to the requestPage state domain
 */
const selectRequestPageDomain = () => (state) => state.get('requestPage');

/**
 * Other specific selectors
 */

const makeSelectRequest = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('request')
);

/**
 * Default selector used by RequestPage
 */

const makeSelectRequestPage = () => createSelector(
  selectRequestPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectRequestPage;
export {
  selectRequestPageDomain,
  makeSelectRequest,
};
