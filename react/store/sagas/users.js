/* eslint-disable no-console */
import {
    call,
    put,
    takeLatest,
    all,
} from 'redux-saga/effects';
import {
    REQUEST_CURRENT_USER,
    receiveCurrentUser,
    REQUEST_LOGIN,
    dataBackLoginPage,
    SEND_REGISTER_FORM,
    SEND_PASSWORD_FORM,
    LOGOUT_USER,
    logOutBackUser,
    SAVE_DATE_USER,
    SAVE_PASSWORD_USER,
    GET_PARTNERS_LIST,
    backPartnersList,
    SEND_PARTNER_ID_FORM,
} from '../actions/users';

import { backMessages } from '../actions/backMessages';
import {
    dataSendingLoginPage,
    changeSectionLoginPage,
    setPartnerId,
    setPartnerIdCeche,
} from '../actions/loginPage';
import { showProgressBar } from '../actions/dashboard';
import { openAlert } from '../actions/alert';

import {
    hFetch,
    sendLogin,
    sendRegisterData,
    sendResetPassword,
    sendlogOutUser,
    saveUserDataJSON,
    saveUserPasswordJSON,
    getPartnersListJSON,
    checkPartnerIdKeyJSON,
} from '../../helpers/jsonAPI';

function* getCurrentUser() {
    try {
        const data = yield call(hFetch, 'users/current');
        yield put(receiveCurrentUser(data));
    } catch (e) {
        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
    }
}

function* loginUser(action) {
    try {
        const data = yield call(sendLogin, { username: action.data.username, password: action.data.password });
        let messages = null;
        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = { message: val.text, type: val.status, place: '' };
                messages.push(msn);
                return true;
            });
        }

        yield all([
            put(dataBackLoginPage(data)),
            put(backMessages(messages)),
            put(dataSendingLoginPage({ dataSending: false })),
        ]);
    } catch (e) {
        yield all([
            put(dataSendingLoginPage({ dataSending: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
        dataBackLoginPage(null);

        console.log(e);
    }
}


function* sendRegisterForm(registerData) {
    try {
        const data = yield call(sendRegisterData, registerData);

        let messages = null;
        let section = 'registerForm';
        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = { message: val.text, type: val.status, place: '' };
                messages.push(msn);
                return true;
            });
        }

        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === true) {
            messages = [{
                message: E.Lang.translate('locals.users.account.sendemailregister'),
                type: 'ok',
                place: '',
                icon: 'done',
            }];
            section = 'registerFormMessage';
        }


        yield all([
            put(changeSectionLoginPage({ curentSection: section })),
            put(backMessages(messages)),
            put(dataSendingLoginPage({ dataSending: false })),
        ]);
    } catch (e) {
        yield all([
            put(dataSendingLoginPage({ dataSending: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
        dataBackLoginPage(null);

        console.log(e);
    }
}


function* getPartnersListSaga(sendData) {
    try {
        const data = yield call(getPartnersListJSON, sendData);

        let messages = null;
        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = { message: val.text, type: val.status, place: '' };
                messages.push(msn);
                return true;
            });
        }

        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === true) {
            yield all([
                put(backPartnersList({ data })),
                put(dataSendingLoginPage({ dataSending: false })),
            ]);
        }
    } catch (e) {
        yield all([
            put(dataSendingLoginPage({ dataSending: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
        dataBackLoginPage(null);

        console.log(e);
    }
}

function* userPasswordChange(action) {
    try {
        const data = yield call(sendResetPassword, action);

        let messages = null;
        let section = 'askPasswordForm';

        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = { message: val.text, type: val.status, place: '' };
                messages.push(msn);
                return true;
            });
        }

        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === true) {
            messages = [{
                message: E.Lang.translate('locals.users.account.sendemailwithpassword'),
                type: 'ok',
                place: '',
                icon: 'done',
            }];
            section = 'registerFormMessage';
        }

        yield all([
            put(changeSectionLoginPage({ curentSection: section })),
            put(backMessages(messages)),
            put(dataSendingLoginPage({ dataSending: false })),
        ]);
    } catch (e) {
        yield all([
            put(dataSendingLoginPage({ dataSending: false })),
            put(openAlert({
                msg: E.Lang.translate('locals.connecting.error'),
                title: E.Lang.translate('locals.connecting.error'),
            })),

        ]);

        const msg = [{ message: e.title, type: 'error', place: '' }];
        backMessages(msg);
        dataBackLoginPage(null);

        console.log(e);
    }
}


function* logOutUserSaga(action) {
    try {
        const data = yield call(sendlogOutUser, action);

        let messages = null;

        if (typeof data !== 'undefined' && data !== null && typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = { message: val.text, type: val.status, place: '' };
                messages.push(msn);
                return true;
            });
        }

        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(logOutBackUser({})),
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
        dataBackLoginPage(null);

        console.log(e);
    }
}


function* saveUserDataSaga(action) {
    try {
        const data = yield call(saveUserDataJSON, action);
        let messages = null;

        if (typeof data.success !== 'undefined' && data.success === false) {
            messages = [];
            data.messages.map((val) => {
                const msn = {
                    message: val.text, type: val.status, place: 'data', icon: 'error',
                };
                messages.push(msn);
                return true;
            });
        }

        if (typeof data.success !== 'undefined' && data.success === true) {
            messages = [{
                message: E.Lang.translate('locals.users.account.yourdatawassaved'),
                type: 'ok',
                place: 'data',
                icon: 'done',
            }];
            data.messages.map((val) => {
                const msn = {
                    message: val.text, type: val.status, place: 'data', icon: 'done',
                };
                messages.push(msn);
                return true;
            });
        }

        yield all([
            put(showProgressBar({ showProgressBar: false })),
            put(backMessages(messages)),

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


function* saveUserPasswordSaga(action) {
    try {
        const data = yield call(saveUserPasswordJSON, action);

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
                put(showProgressBar({ showProgressBar: false })),
                put(backMessages(messages)),
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
                put(showProgressBar({ showProgressBar: false })),
                put(backMessages(messages)),
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

        console.log(e);
    }
}

function* checkPartnerIdKey(action) {
    try {
        const data = yield call(checkPartnerIdKeyJSON, action);
        if (typeof data.success !== 'undefined' && data.success === false) {
            const messages = [];
            data.messages.map((val) => {
                const msn = { message: val.text, type: val.status, place: '' };
                messages.push(msn);
                return true;
            });
            yield all([
                put(backMessages(messages)),
                put(dataSendingLoginPage({ dataSending: false })),
                put(setPartnerId({ partnerId: false })),
                put(setPartnerIdCeche({ partnerIdCeche: '' })),
            ]);
        }
        if (typeof data.success !== 'undefined' && data.success === true) {
            yield all([
                put(dataSendingLoginPage({ dataSending: false })),
                put(setPartnerId({ partnerId: action.data.partnerId })),
                put(setPartnerIdCeche({ partnerIdCeche: action.data.partnerId })),
            ]);
        }
    } catch (e) {
        yield all([
            put(dataSendingLoginPage({ dataSending: false })),
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
    yield takeLatest(REQUEST_CURRENT_USER, getCurrentUser);
    yield takeLatest(REQUEST_LOGIN, loginUser);
    yield takeLatest(SEND_REGISTER_FORM, sendRegisterForm);
    yield takeLatest(SEND_PASSWORD_FORM, userPasswordChange);
    yield takeLatest(LOGOUT_USER, logOutUserSaga);
    yield takeLatest(SAVE_DATE_USER, saveUserDataSaga);
    yield takeLatest(SAVE_PASSWORD_USER, saveUserPasswordSaga);
    yield takeLatest(GET_PARTNERS_LIST, getPartnersListSaga);
    yield takeLatest(SEND_PARTNER_ID_FORM, checkPartnerIdKey);
}
