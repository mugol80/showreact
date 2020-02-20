/* eslint-disable no-console */

import {
    call,
    put,
    takeLatest,
    all,
} from 'redux-saga/effects';
import { getListContentsJSON } from '../../helpers/jsonAPI';
import {
    GET_CONTENTS,
    listContents,
    setInProgress,
} from '../actions/contents';
import { openAlert } from '../actions/alert';


function* getListContents() {
    try {
        const data = yield call(getListContentsJSON);
        yield all([
            put(setInProgress({ inProgress: false })),
            put(listContents({ contents: data.Content })),
        ]);
    } catch (e) {
        yield all([
            put(setInProgress({ inProgress: false })),
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
    yield takeLatest(GET_CONTENTS, getListContents);
}
