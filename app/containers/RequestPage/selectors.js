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

const selectLoadingExecRequest = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('loadingExecRequest')
);

const selectRequestList = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('requestList')
);

const selectErrorSend = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('errorSend'),
);

const selectUser = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('user')
);

const selectNewRequestDialogOpen = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('newRequestDialogOpen'),
);

const selectNewRequestDialogName = () => createSelector(
  selectRequestPageDomain(),
  (requestPageState) => requestPageState.get('newRequestDialogName'),
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
  selectErrorSend,
  selectLoadingExecRequest,
  selectRequestList,
  selectAuthToken,
  selectUser,
  selectNewRequestDialogOpen,
  selectNewRequestDialogName,
};
