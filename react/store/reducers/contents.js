import {
    LIST_CONTENTS,
    SET_CONTENT,
    SET_IN_PROGRESS,
    SET_SHOW_CONTENT,
} from '../actions/contents';

const initialState = {
    contentsList: [],
    content: '',
    showContent: false,
    inProgress: false,
};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case LIST_CONTENTS:
            return {
                ...state,
                contentsList: data.contents,
            };

        case SET_CONTENT:
            return {
                ...state,
                content: data,
            };

        case SET_IN_PROGRESS:
            return {
                ...state,
                inProgress: data.inProgress,
            };

        case SET_SHOW_CONTENT:
            return {
                ...state,
                showContent: data,
            };

        default:
            return state;
    }
};
