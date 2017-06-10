// import { take, call, put, select } from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'react-router-redux';
import { cancel, put, take, takeLatest } from 'redux-saga/effects';
// import request from 'utils/request';
import { SEND_EXEC_REQUEST, sendExecRequestSuccess } from './actions';

// export function* sendExecRequest(action) {
//   const requestURL = '/api/v1/requests/4RKP9Xzjd5xAvOElgbLe';
//   const method = 'PUT';
//   const options = {
//     method,
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: action.request,
//   };
//
//   try {
//     const { json } = yield call(request, requestURL, options);
//     yield put(loadTaskListSuccess(json));
//   } catch (err) {
//     yield put(loadTaskListError(err));
//   }
// }

export function* sendExecRequest(action) {
  yield put(sendExecRequestSuccess({
    id: '22222',
    name: 'hello, there',
    data: {
      method: 'DELETE',
      url: 'http://ya.ru',
    },
  }));
}


export function* sendExecRequestData() {
  const watcher = yield takeLatest(SEND_EXEC_REQUEST, sendExecRequest);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  sendExecRequestData,
];
