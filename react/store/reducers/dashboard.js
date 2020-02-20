import { SHOW_PROGRESS_BAR, SET_MOUNTED } from '../actions/dashboard';

const initialState = {
    showProgressBar: false,
    isMounted: false,
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case SHOW_PROGRESS_BAR:
            return {
                ...state,
                showProgressBar: data.showProgressBar,
            };

        case SET_MOUNTED:
            return {
                ...state,
                isMounted: data.isMounted,
            };

        default:
            return state;
    }
};
