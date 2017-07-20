import { fromJS } from 'immutable';
import Logger from 'js-logger';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import { delay } from 'redux-saga';
import { call, cancel, cancelled, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { getAuthTokenOrNull, storeAuthToken } from '../../utils/localStorageHelper';
import {
  CANCEL_EXEC_REQUEST,
  LOAD_AUTH_TOKEN,
  SEND_COPY_REQUEST,
  SEND_CREATE_REQUEST,
  SEND_DELETE_REQUEST,
  SEND_EXEC_REQUEST,
  SEND_GET_REQUEST,
  SEND_GET_REQUEST_LIST,
  sendCreateRequestSuccess,
  sendDeleteRequestError,
  sendDeleteRequestSuccess,
  sendExecRequestError,
  sendExecRequestSuccess,
  sendGetRequestError,
  sendGetRequestListError,
  sendGetRequestListSuccess,
  sendGetRequestSuccess,
  setAuthToken,
} from './actions';
import { makeSelectRequest, selectAuthToken } from './selectors';

function* sendCreateRequest(action) {
  yield call(loadAuthToken);

  const authToken = yield select(selectAuthToken());
  const requestURL = '/api/v1/requests';

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      name: action.name,
    }),
  };

  try {
    const req = yield call(request, requestURL, options);
    yield put(sendCreateRequestSuccess(fromJS(req)));
    yield put(push(`/request/${req.id}`));
  } catch (err) {
    yield put(sendExecRequestError(err));
  }
}

export function* sendExecRequest() {
  const req = yield select(makeSelectRequest());

  const authToken = yield select(selectAuthToken());
  const requestURL = `/api/v1/requests/${req.get('id')}`;
  const method = 'PUT';
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(req.get('data')),
  };

  try {
    yield call(request, requestURL, options);
    yield call(tryLoadResponseUntilDone);
  } catch (err) {
    yield put(sendExecRequestError(err));
  }
}

export function* tryLoadResponseUntilDone() {
  const loadTask = yield fork(loadRequestUntilDone);
  yield take(CANCEL_EXEC_REQUEST);
  yield cancel(loadTask);
}

function* loadRequestUntilDone() {
  const req = yield select(makeSelectRequest());
  const authToken = yield select(selectAuthToken());

  try {
    for (let i = 0; i < 10; i += 1) {
      const requestURL = `/api/v1/requests/${req.get('id')}`;
      const method = 'GET';
      const options = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      };

      let loadedReq = null;

      try {
        loadedReq = yield call(request, requestURL, options);
      } catch (err) {
        yield put(sendExecRequestError(err));
        break;
      }

      if (loadedReq.status.status === 'in_progress') {
        yield call(delay, 1000);
      } else if (loadedReq.status.status === 'error') {
        yield put(sendExecRequestError('error from server'));
        return;
      } else {
        yield put(sendExecRequestSuccess(fromJS(loadedReq)));
        yield put(push(`/request/${loadedReq.id}`));
        return;
      }
    }
    yield put(sendExecRequestError('Waiting response timeout'));
  } finally {
    if (yield cancelled()) {
      yield put(sendExecRequestError('Task cancelled'));
    }
  }
}

export function* sendRequestList() {
  yield call(loadAuthToken);

  const authToken = yield select(selectAuthToken());
  const requestURL = '/api/v1/requests';
  const method = 'GET';
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const json = yield call(request, requestURL, options);
    const requestList = fromJS(json);
    yield put(sendGetRequestListSuccess(requestList));
  } catch (err) {
    yield put(sendGetRequestListError(err));
  }
}

export function* sendGetRequest(action) {
  yield call(loadAuthToken);

  const authToken = yield select(selectAuthToken());
  const requestURL = `/api/v1/requests/${action.requestId}`;
  const method = 'GET';
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const json = yield call(request, requestURL, options);
    const requestJson = fromJS(json);
    yield put(sendGetRequestSuccess(requestJson));
  } catch (err) {
    yield put(sendGetRequestError(err));
  }
}

export function* sendDeleteRequest(action) {
  yield call(loadAuthToken);

  const authToken = yield select(selectAuthToken());
  const requestURL = `/api/v1/requests/${action.requestId}`;
  const method = 'DELETE';
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    yield call(request, requestURL, options);
    yield put(push('/request'));
    yield put(sendDeleteRequestSuccess(action.requestId));
  } catch (err) {
    yield put(sendDeleteRequestError(err));
  }
}

export function* sendCopyRequest() {
  yield call(loadAuthToken);

  const authToken = yield select(selectAuthToken());
  const req = yield select(makeSelectRequest());

  const requestURL = `/api/v1/requests/${req.get('id')}/copy`;
  const method = 'POST';
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const json = yield call(request, requestURL, options);
    const requestJson = fromJS(json);
    yield put(sendExecRequestSuccess(requestJson));
    yield put(push(`/request/${requestJson.get('id')}`));
  } catch (err) {
    yield put(sendExecRequestError(err));
  }
}

export function* loadAuthToken() {
  const authToken = getAuthTokenOrNull();
  if (authToken) {
    yield put(setAuthToken(authToken));
    return;
  }

  const requestURL = '/api/v1/authTokens';
  const method = 'POST';
  const options = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  try {
    const json = yield call(request, requestURL, options);
    storeAuthToken(json.auth_token);
    yield put(setAuthToken(json.auth_token));
  } catch (err) {
    Logger.error('Requesting authTokens', err);
  }
}

export function* sendExecRequestData() {
  const watcher = yield takeLatest(SEND_EXEC_REQUEST, sendExecRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


export function* sendCreateRequestData() {
  const watcher = yield takeLatest(SEND_CREATE_REQUEST, sendCreateRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sendGetRequestListData() {
  const watcher = yield takeLatest(SEND_GET_REQUEST_LIST, sendRequestList);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sendGetRequestData() {
  const watcher = yield takeLatest(SEND_GET_REQUEST, sendGetRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sendDeleteRequestData() {
  const watcher = yield takeLatest(SEND_DELETE_REQUEST, sendDeleteRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* sendCopyRequestData() {
  const watcher = yield takeLatest(SEND_COPY_REQUEST, sendCopyRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* loadAuthTokenData() {
  const watcher = yield takeLatest(LOAD_AUTH_TOKEN, loadAuthToken);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  sendExecRequestData,
  sendGetRequestListData,
  sendGetRequestData,
  loadAuthTokenData,
  sendCopyRequestData,
  sendDeleteRequestData,
  sendCreateRequestData,
];
