import {
    BACK_MESSAGES,
    CLEAR_MESSAGES,
} from '../actions/backMessages';

const initialState = {
    messages: null,
};

// DATA:
// Retrun to state Array of OBJECTS
// {message: (string)'TXT', type: (string)''||'error'||failed||'ok', place: (string)'', icon}

export default (state = initialState, { type, data }) => {
    switch (type) {
        case BACK_MESSAGES: {
            let back = null;
            if (typeof data !== 'undefined' && data !== null && data.length > 0) {
                back = data;
            }
            return {
                ...state,
                messages: back,
            };
        }
        case CLEAR_MESSAGES: {
            return {
                ...state,
                messages: null,
            };
        }
        default:
            return state;
    }
};
