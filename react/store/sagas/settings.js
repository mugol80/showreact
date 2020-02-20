/* eslint-disable no-console */
import {
    call,
    put,
    takeLatest,
    all,
} from 'redux-saga/effects';

import {
    getListFairsJSON,
    saveFairJSON,
} from '../../helpers/jsonAPI';

import {
    SAVE_FAIR,
    GET_FAIRS_LIST,
    setSettingValue,
    setInProgress,
} from '../actions/settings';
import { openAlert } from '../actions/alert';

function* getFairsList() {
    try {
        const data = yield call(getListFairsJSON);
        yield all([
            put(setSettingValue({ name: 'campaignList', value: data.FairsList })),
            put(setInProgress({ id: 'getFairsList', action: 'rm' })),
        ]);
    } catch (e) {
        yield all([
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),
            put(setSettingValue({ name: 'source_id', value: false })),
            put(setInProgress({ id: 'getFairsList', action: 'rm' })),

        ]);
        console.log(e);
    }
}

function* saveFair(action) {
    try {
        const data = yield call(saveFairJSON, action.data);
        let messages = null;
        if (typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = {
                    message: val.text, type: val.status, place: 'pass', icon: 'error',
                };
                messages.push(msn);
                return true;
            });

            yield all([
                put(setInProgress({ id: 'saveFair', action: 'rm' })),
            ]);
        }

        if (typeof data.success !== 'undefined' && data.success === true) {
            messages = [{
                message: E.Lang.translate('locals.users.account.yourpasswordwaschanged'),
                type: 'ok',
                place: 'pass',
                icon: 'done',
            }];
            data.messages.map((val) => {
                const msn = {
                    message: val.text, type: val.status, place: 'pass', icon: 'done',
                };
                messages.push(msn);
                return true;
            });
            yield all([
                put(setInProgress({ id: 'saveFair', action: 'rm' })),
            ]);
        }
    } catch (e) {
        yield all([
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),
            put(setInProgress({ id: 'saveFair', action: 'rm' })),
        ]);
        console.log(e);
    }
}

export default function* usersSaga() {
    yield takeLatest(GET_FAIRS_LIST, getFairsList);
    yield takeLatest(SAVE_FAIR, saveFair);
}
