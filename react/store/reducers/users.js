import {
    REQUEST_CURRENT_USER,
    RECEIVE_CURRENT_USER,
    DATA_BACK_LOGINPAGE,
    LOGOUT_BACK_USER,
    BACK_PARTNERS_LIST,
}
    from '../actions/users';

const initialState = {
    isLoginIn: false,
    user: null,
    preloading: true,
    partnersList: null,
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case REQUEST_CURRENT_USER: {
            return {
                ...state,
                user: null,
            };
        }
        case RECEIVE_CURRENT_USER: {
            if (typeof data !== 'undefined'
                && data !== null
                && typeof data.success !== 'undefined'
                && data.success === true
                && typeof data.User !== 'undefined'
                && data.User.length !== 0) {
                return {
                    ...state,
                    user: data.User,
                    isLoginIn: true,
                    preloading: false,
                };
            }
            return {
                ...state,
                user: null,
                isLoginIn: false,
                preloading: false,
            };
        }
        case DATA_BACK_LOGINPAGE: {
            if (typeof data !== 'undefined'
                && data !== null
                && typeof data.success !== 'undefined'
                && data.success === true
                && typeof data.User !== 'undefined') {
                return {
                    ...state,
                    user: data.User,
                    isLoginIn: true,
                };
            }
            return {
                ...state,
                isLoginIn: false,
            };
        }
        case LOGOUT_BACK_USER: {
            return {
                ...state,
                user: null,
                isLoginIn: false,
            };
        }
        case BACK_PARTNERS_LIST: {
            return {
                ...state,
                partnersList: data.data.Partner,
            };
        }
        default:
            return state;
    }
};
