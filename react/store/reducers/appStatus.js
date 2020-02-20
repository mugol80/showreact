import {
    SET_ONLINE_STATUS,
    SET_INDEXDB,
} from '../actions/appStatus';

const initialState = {
    isOnLine: true,
    indexDB: false,
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case SET_ONLINE_STATUS: {
            return {
                ...state,
                isOnLine: data.isOnLine,
            };
        }
        case SET_INDEXDB: {
            return {
                ...state,
                indexDB: data.indexDB,
            };
        }
        default:
            return state;
    }
};
