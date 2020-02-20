/* eslint-disable no-console */
import {
    call,
    put,
    takeEvery,
    all,
} from 'redux-saga/effects';

import { getStoredLeadsDB } from '../../helpers/jsonAPI';

import {
    GET_STORED_LEADS_LIST,
    setStoredLeadsList,
} from '../actions/storedLeads';

function* getStoredList() {
    try {
        const data = yield call(getStoredLeadsDB);
        yield all([
            put(setStoredLeadsList({ storedLeadsList: data })),
        ]);
    } catch (e) {
        // TODO
        console.log(e);
    }
}
export default function* usersSaga() {
    yield takeEvery(GET_STORED_LEADS_LIST, getStoredList);
}
