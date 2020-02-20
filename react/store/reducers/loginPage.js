import {
    CHANGE_SECTION_LOGINPAGE,
    DATA_SENDING_LOGINPAGE,
    SET_PARTNER_ID,
    SET_PARTNER_ID_CECHE,
} from '../actions/loginPage';

const initialState = {
    curentSection: 'loginForm',
    dataSending: false,
    partnerId: false,
    partnerIdCeche: '',
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case CHANGE_SECTION_LOGINPAGE:
            return {
                ...state,
                curentSection: data.curentSection,
                dataSending: false,
            };
        case DATA_SENDING_LOGINPAGE:
            return {
                ...state,
                dataSending: data.dataSending,
            };
        case SET_PARTNER_ID:
            return {
                ...state,
                partnerId: data.partnerId,
            };
        case SET_PARTNER_ID_CECHE:
            return {
                ...state,
                partnerIdCeche: data.partnerIdCeche,
            };
        default:
            return state;
    }
};
