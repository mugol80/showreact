export const REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const DATA_BACK_LOGINPAGE = 'DATA_BACK_LOGINPAGE';
export const SEND_REGISTER_FORM = 'SEND_REGISTER_FORM';
export const SEND_PASSWORD_FORM = 'SEND_PASSWORD_FORM';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGOUT_BACK_USER = 'LOGOUT_BACK_USER';
export const SAVE_DATE_USER = 'SAVE_DATE_USER';
export const SAVE_PASSWORD_USER = 'SAVE_PASSWORD_USER';
export const GET_PARTNERS_LIST = 'GET_PARTNERS_LIST';
export const BACK_PARTNERS_LIST = 'BACK_PARTNERS_LIST';
export const SEND_PARTNER_ID_FORM = 'SEND_PARTNER_ID_FORM';

export const requestCurrentUser = () => ({ type: REQUEST_CURRENT_USER });
export const receiveCurrentUser = (data) => ({ type: RECEIVE_CURRENT_USER, data });
export const requestLogin = (data) => ({ type: REQUEST_LOGIN, data });
export const dataBackLoginPage = (data) => ({ type: DATA_BACK_LOGINPAGE, data });
export const sendRegisterForm = (data) => ({ type: SEND_REGISTER_FORM, data });
export const sendPasswordForm = (data) => ({ type: SEND_PASSWORD_FORM, data });
export const logOutUser = (data) => ({ type: LOGOUT_USER, data });
export const logOutBackUser = (data) => ({ type: LOGOUT_BACK_USER, data });
export const saveUserData = (data) => ({ type: SAVE_DATE_USER, data });
export const saveUserPassword = (data) => ({ type: SAVE_PASSWORD_USER, data });
export const sendPartnerIdForm = (data) => ({ type: SEND_PARTNER_ID_FORM, data });

export const getPartnersList = (data) => ({ type: GET_PARTNERS_LIST, data });
export const backPartnersList = (data) => ({ type: BACK_PARTNERS_LIST, data });
