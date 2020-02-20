export const CHANGE_SECTION_LOGINPAGE = 'CHANGE_SECTION_LOGINPAGE';
export const DATA_SENDING_LOGINPAGE = 'DATA_SENDING_LOGINPAGE';
export const SET_PARTNER_ID = 'SET_PARTNER_ID';
export const SET_PARTNER_ID_CECHE = 'SET_PARTNER_ID_CECHE';

export const changeSectionLoginPage = (data) => ({ type: CHANGE_SECTION_LOGINPAGE, data });
export const dataSendingLoginPage = (data) => ({ type: DATA_SENDING_LOGINPAGE, data });
export const setPartnerId = (data) => ({ type: SET_PARTNER_ID, data });
export const setPartnerIdCeche = (data) => ({ type: SET_PARTNER_ID_CECHE, data });
