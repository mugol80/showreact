import {
    call,
    put,
    takeLatest,
    takeEvery,
    all,
} from 'redux-saga/effects';
import { addressGeocodingJSON } from '../../helpers/jsonAPI';
import {
    ADDRESS_GEOCODING,
    ADDRESS_GEOCODING_ONCE,
    ADDRESS_GEOCODING_BACK,
    addressGeocodingBack,
} from '../actions/googleMaps';
import { openAlert } from '../actions/alert';

function* getAddressGeocoding(action) {
    try {
        const data = yield call(addressGeocodingJSON, action.data);
        const callback = action.data.callback ? action.data.callback : false;
        const leadData = action.data.leadData ? action.data.leadData : false;
        const uuid = action.data.uuid ? action.data.uuid : false;
        data.leadData = leadData;
        yield all([
            put(addressGeocodingBack({ data, callback, uuid })),
        ]);
    } catch (e) {
        yield all([
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        /* eslint-disable no-console */
        console.log([{ message: e.title, type: 'error', place: '' }]);
        console.log(e);
        /* eslint-enable no-console */
    }
}

function addressGeocodingBackSaga({ type, params }) {
    if (params.callback && type === ADDRESS_GEOCODING_BACK) {
        params.callback(params.data);
    }
}

export default function* googleMaps() {
    yield takeLatest(ADDRESS_GEOCODING_ONCE, getAddressGeocoding);
    yield takeEvery(ADDRESS_GEOCODING, getAddressGeocoding);
    yield takeEvery(ADDRESS_GEOCODING_BACK, addressGeocodingBackSaga);
}
