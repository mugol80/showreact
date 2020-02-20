/* eslint-disable no-console */
import {
    call,
    put,
    takeEvery,
    all,
} from 'redux-saga/effects';
import { openAlert } from '../actions/alert';
import { saveMarkersJSON } from '../../helpers/jsonAPI';
import { SAVE_LEAD, SAVE_LEAD_BACK, saveLeadBack } from '../actions/lead';
import { leadUpdateData } from '../actions/leadOnMap';
import { gridUpdateData } from '../actions/grid';


function* saveLead(action) {
    try {
        const data = yield call(saveMarkersJSON, action);
        const callback = action.data.callback ? action.data.callback : false;
        const updateData = data.Lead;
        updateData.gn_temp_data_json = JSON.parse(updateData.gn_temp_data_json);
        yield all([
            put(saveLeadBack({ data, callback })),
            put(gridUpdateData({
                updateData: data.Lead,
                uuid: action.data.gridUuid,
                id: action.data.id,
                idLabel: action.data.fieldLabel,
                modelName: action.data.modelName,
            })),
            put(leadUpdateData({
                updateData: data.Lead,
                uuid: action.data.gridUuid,
                id: action.data.id,
                idLabel: action.data.fieldLabel,
                modelName: action.data.modelName,
            })),
        ]);
    } catch (e) {
        const { callback, data } = action.data;
        const updateData = data.Lead;
        updateData.gn_temp_data_json = JSON.parse(updateData.gn_temp_data_json);
        yield all([
            put(saveLeadBack({ data, callback })),
            put(gridUpdateData({
                updateData: data.Lead,
                uuid: action.data.gridUuid,
                id: action.data.id,
                idLabel: action.data.fieldLabel,
                modelName: action.data.modelName,
            })),
            put(leadUpdateData({
                updateData: data.Lead,
                uuid: action.data.gridUuid,
                id: action.data.id,
                idLabel: action.data.fieldLabel,
                modelName: action.data.modelName,
            })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);
        console.log(e);
    }
}

function saveLeadBackSaga({ type, data }) {
    if (data.callback && type === SAVE_LEAD_BACK) {
        data.callback(data.data);
    }
}

export default function* usersSaga() {
    yield takeEvery(SAVE_LEAD, saveLead);
    yield takeEvery(SAVE_LEAD_BACK, saveLeadBackSaga);
}
