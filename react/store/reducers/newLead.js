import {
    SECTION_NEW_LEAD,
    LEADS_FIELDS_NEW_LEAD,
    COUNTRIES_LIST,
} from '../actions/newLead';

const initialState = {
    section: 'form',
    fields: {},
    countriesList: {},
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case SECTION_NEW_LEAD:
            return {
                ...state,
                section: data.section,
            };

        case LEADS_FIELDS_NEW_LEAD:
            return {
                ...state,
                fields: data.fields,
            };

        case COUNTRIES_LIST:
            return {
                ...state,
                countriesList: data.fields,
            };
        default:
            return state;
    }
};
