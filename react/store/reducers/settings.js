import {
    SET_SETTINGS_VALUE,
    SET_IN_PROGRESS,
} from '../actions/settings';

const initialState = {
    inProgress: [],
    settingForUserActive: true,
    showSettingWindow: false,
    source_id: false,
    sourceFixed: false,
    campaign_id: false,
    campaignList: [],
    campaignFixed: false,

};

export default (state = initialState, { type, data }) => {
    switch (type) {
        case SET_SETTINGS_VALUE: {
            if (data.name === 'campaignList') {
                if (data.value.length === 0) {
                    return {
                        ...state,
                        source_id: false,
                        campaign_id: false,
                        campaignFixed: false,
                        sourceFixed: false,
                        [data.name]: data.value,
                    };
                }

                return {
                    ...state,
                    [data.name]: data.value,
                };
            }
            if (data.name === 'source_id') {
                if (!data.value) {
                    return {
                        ...state,
                        campaign_id: false,
                        [data.name]: data.value,
                    };
                }
                if ((!state.campaign_id
                    && state.campaignList.length > 0)
                    || (state.campaign_id
                        && state.campaignList.length > 0
                        && !state.campaignList.find((x) => x.id === state.campaign_id))
                ) {
                    return {
                        ...state,
                        campaignFixed: false,
                        sourceFixed: false,
                        campaign_id: state.campaignList[0].id,
                        [data.name]: data.value,
                    };
                }
                return {
                    ...state,
                    [data.name]: data.value,
                };
            }

            return {
                ...state,
                [data.name]: data.value,
            };
        }
        case SET_IN_PROGRESS: {
            const progress = state.inProgress;
            if (data.action === 'add') {
                if (!progress.includes(data.id)) {
                    progress.push(data.id);
                }
            } else {
                for (let i = 0; i < progress.length; i++) {
                    if (progress[i] === data.id) {
                        progress.splice(i, 1);
                    }
                }
            }

            return {
                ...state,
                inProgress: progress,
            };
        }
        default:
            return state;
    }
};
