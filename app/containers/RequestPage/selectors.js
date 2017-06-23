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

const selectErrorExecRequest = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('errorExecRequest')
);

const selectLoadingExecRequest = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('loadingExecRequest')
);

const selectRequestList = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('requestList')
);

const selectUser = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('user')
);

const selectAuthToken = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('authToken')
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
  selectErrorExecRequest,
  selectLoadingExecRequest,
  selectRequestList,
  selectAuthToken,
  selectUser,
};
