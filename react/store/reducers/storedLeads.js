import {
    SET_STORED_LEADS_LIST,
    SET_SHOW_LIST_WINDOW_OPEN,
} from '../actions/storedLeads';

const initialState = {
    storedLeadsList: [],
    showListWindowOpen: false,
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case SET_STORED_LEADS_LIST: {
            return {
                ...state,
                storedLeadsList: data.storedLeadsList,
            };
        }
        case SET_SHOW_LIST_WINDOW_OPEN: {
            return {
                ...state,
                showListWindowOpen: data.showListWindowOpen,
            };
        }
        default:
            return state;
    }
};
