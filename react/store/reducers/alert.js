import {
    OPEN_ALERT,
    CLOSE_ALERT,
} from '../actions/alert';

const initialState = {
    msg: '',
    title: '',
    open: false,
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case OPEN_ALERT:
            return {
                ...state,
                open: true,
                msg: data.msg,
                title: data.title,
            };
        case CLOSE_ALERT:
            return {
                ...state,
                open: false,
                msg: '',
                title: '',
            };
        default:
            return state;
    }
};
