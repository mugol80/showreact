import { fork, all } from 'redux-saga/effects';
import UsersSaga from './users';
import newLeadSaga from './newLead';
import gridSaga from './grid';
import contents from './contents';
import ocr from './ocr';
import settings from './settings';
import googleMaps from './googleMaps';
import lead from './lead';
import leadOnMap from './leadOnMap';
import storedLeads from './storedLeads';

export default function* rootSaga() {
    yield all([
        fork(UsersSaga),
        fork(newLeadSaga),
        fork(gridSaga),
        fork(contents),
        fork(ocr),
        fork(settings),
        fork(googleMaps),
        fork(lead),
        fork(leadOnMap),
        fork(storedLeads),
    ]);
}
