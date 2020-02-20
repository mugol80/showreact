/* eslint-disable no-console */

import {
    call,
    put,
    takeLatest,
    all,
} from 'redux-saga/effects';
import { backMessages } from '../actions/backMessages';
import { showProgressBar } from '../actions/dashboard';
import {
    sendNewLeadJSON,
    getLeadsFieldsJSON,
    getCountriesListJSON,
} from '../../helpers/jsonAPI';
import {
    SEND_NEW_LEAD,
    sectionNewLead,
    GET_LEADS_FIELDS_NEW_LEAD,
    leadsFieldsNewLead,
    GET_COUNTRIES_LIST,
    countriesList,
} from '../actions/newLead';
import { openAlert } from '../actions/alert';

function* sendNewLeadSaga(action) {
    try {
        const response = yield call(sendNewLeadJSON, action);
        const { status, data } = response;

        let messages = null;
        let section = 'form';

        if (status === 200) {
            if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === true) {
                messages = [{
                    message: E.Lang.translate('locals.newleadform.success'), type: 'ok', place: '', icon: 'done',
                }];
                section = 'message';
            }

            if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === false) {
                messages = [];
                data.messages.map((val) => {
                    const msn = { message: val.text, type: val.status, place: '' };
                    messages.push(msn);
                    return true;
                });
            }
        }

        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(sectionNewLead({ section })),
            put(backMessages(messages)),
        ]);

        if (!data || status !== 200) {
            yield all([
                put(openAlert({
                    msg: E.Lang.translate('locals.connecting.error'),
                    title: E.Lang.translate('locals.connecting.error'),
                })),
            ]);
        }
    } catch (e) {
        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
    }
}

function* getLeadsFields() {
    try {
        const data = yield call(getLeadsFieldsJSON);

        yield all([
            put(leadsFieldsNewLead({ fields: data })),
        ]);
    } catch (e) {
        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
        console.log(e);
    }
}

function* getCountriesList() {
    try {
        const data = yield call(getCountriesListJSON);

        yield all([
            put(countriesList({ fields: data })),
        ]);
    } catch (e) {
        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);

        console.log(e);
    }
}

export default function* usersSaga() {
    yield takeLatest(SEND_NEW_LEAD, sendNewLeadSaga);
    yield takeLatest(GET_LEADS_FIELDS_NEW_LEAD, getLeadsFields);
    yield takeLatest(GET_COUNTRIES_LIST, getCountriesList);
}
