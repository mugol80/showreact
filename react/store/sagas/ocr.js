/* eslint-disable no-console */
import {
    call,
    put,
    takeEvery,
    all,
} from 'redux-saga/effects';

import { sendPhotoJSON } from '../../helpers/jsonAPI';

import {
    SEND_PHOTO,
    backOcr,
} from '../actions/ocr';
import { openAlert } from '../actions/alert';
import { showProgressBar } from '../actions/dashboard';

function* sendPhoto(action) {
    try {
        const data = yield call(sendPhotoJSON, action.data);
        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(backOcr({ data, id: action.data.id })),
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
        console.log(e);
        console.log(msg);
    }
}

export default function* usersSaga() {
    yield takeEvery(SEND_PHOTO, sendPhoto);
}
