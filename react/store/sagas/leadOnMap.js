import {
    call,
    put,
    takeEvery,
} from 'redux-saga/effects';
import { openAlert } from '../actions/alert';

import {
    GET_LEADS_LIST,
    receiveLeadsList,
} from '../actions/leadOnMap';

import { gridFetch } from '../../helpers/jsonAPI';

function* getData(action) {
    try {
        const data = yield call(gridFetch, action.params);
        data.modelName = action.params.modelName;
        data.uuid = action.params.uuid;
        yield put(receiveLeadsList(data));
    } catch (e) {
        yield put(openAlert({
            msg: e.toString(),
            title: 'Error on fetching data.',
        }));
    }
}


export default function* gridSaga() {
    yield takeEvery(GET_LEADS_LIST, getData);
}
