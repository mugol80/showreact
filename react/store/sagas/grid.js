/* eslint-disable no-console */

import {
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';
import { openAlert } from '../actions/alert';

import {
    GRID_REQUEST_DATA,
    GRID_REQUEST_UPDATE,
    GRID_CSV_GENERATE,
    gridReceiveData,
    gridFulfillUpdate,
    gridCsvReturn,
} from '../actions/grid';

import { gridFetch, gridUpdate } from '../../helpers/jsonAPI';

function* getData(action) {
    try {
        const data = yield call(gridFetch, action.params);
        data.modelName = action.params.modelName;
        data.uuid = action.params.uuid;
        yield put(gridReceiveData(data));
    } catch (e) {
        yield put(openAlert({
            msg: e.toString(),
            title: 'Error on fetching data.',
        }));
    }
}


function* getCsvData(action) {
    try {
        const data = yield call(gridFetch, action.params);
        data.modelName = action.params.modelName;
        data.uuid = action.params.uuid;
        yield put(gridCsvReturn(data));
    } catch (e) {
        yield put(openAlert({
            msg: e.toString(),
            title: 'Error on fetching data.',
        }));
    }
}

function* updateData(action) {
    try {
        const data = yield call(gridUpdate, action.params);
        data.modelName = action.params.modelName;
        data.uuid = action.params.uuid;
        yield put(gridFulfillUpdate(data));
    } catch (e) {
        console.log(e);
    }
}

export default function* gridSaga() {
    yield takeEvery(GRID_REQUEST_DATA, getData);
    yield takeEvery(GRID_REQUEST_UPDATE, updateData);
    yield takeEvery(GRID_CSV_GENERATE, getCsvData);
}
