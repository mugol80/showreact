/* eslint no-param-reassign: [0] */
import { cloneDeep } from 'lodash';

import {
    RECEIVE_LEADS_LIST,
    GET_LEADS_LIST,
    WORK_IN_PROGRESS_LEAD_ON_MAP,
    SET_LEADS_SAVING,
    SET_LEAD_TO_SAVE,
    SET_LEAD_IS_SAVE,
    SET_LEADS_ASKING,
    SET_LEAD_TO_ASK,
    SET_LEAD_IS_ASK,
    LEAD_UPDATE_DATA,
} from '../actions/leadOnMap';

import { ADDRESS_GEOCODING_BACK } from '../actions/googleMaps';

const initialState = {};

export default (state = initialState, { type, params }) => {
    switch (type) {
        case GET_LEADS_LIST: {
            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                },
            };
            state[params.uuid].jsonData = {};
            state[params.uuid].markers = [];
            state[params.uuid].leadsToAsk = [];
            state[params.uuid].leadsInAsking = []; // {lead: {lead object}, asking: true||false}
            state[params.uuid].leadsToAskBuffor = 10;
            state[params.uuid].leadsIsAsking = false;
            state[params.uuid].leadsToSave = [];
            state[params.uuid].leadsSaveFail = [];
            state[params.uuid].leadsInSaveing = []; // {lead: {lead object}, saveing: true||false}
            state[params.uuid].leadsIsSaveing = false;
            state[params.uuid].leadsSaveingBuffor = 3;
            state[params.uuid].leadsNoAddressFound = [];
            state[params.uuid].googleMapsSetting = {};
            state[params.uuid].loading = true;
            state[params.uuid].workInProgress = false;
            return state;
        }
        case WORK_IN_PROGRESS_LEAD_ON_MAP: {
            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    workInProgress: params.workInProgress,
                },
            };
            return state;
        }
        case SET_LEADS_SAVING: {
            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    leadsIsSaveing: params.leadsIsSaveing,
                },
            };
            return state;
        }
        case SET_LEAD_TO_SAVE: {
            const leadsInSaveing = cloneDeep(state[params.uuid].leadsInSaveing);
            const leadsToSave = cloneDeep(state[params.uuid].leadsToSave);
            if (leadsInSaveing.length < state[params.uuid].leadsSaveingBuffor) {
                for (let i = 0; i <= state[params.uuid].leadsToSave.length; i++) {
                    if (leadsInSaveing.length >= state[params.uuid].leadsSaveingBuffor) {
                        break;
                    }
                    const elm = leadsToSave.splice(i, 1);
                    if (elm && elm.length === 1 && Object.prototype.hasOwnProperty.call(elm[0], 'id')) {
                        leadsInSaveing.push({ lead: elm[0], saveing: false });
                    }
                }
            }

            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    leadsInSaveing,
                    leadsToSave,
                },
            };
            return state;
        }
        case SET_LEAD_IS_SAVE: {
            const leadsInSaveing = cloneDeep(state[params.uuid].leadsInSaveing);
            Object.entries(leadsInSaveing).forEach((element, idx) => {
                if (leadsInSaveing[idx].lead.id === params.id) {
                    leadsInSaveing[idx].saveing = params.saveing;
                }
            });
            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    leadsInSaveing,
                },
            };
            return state;
        }
        case RECEIVE_LEADS_LIST: {
            const markers = [];
            const leadsToAsk = [];

            if (params.success && params.Lead.length > 0) {
                params.Lead.map((val) => {
                    if (Object.prototype.hasOwnProperty.call(val.gn_temp_data_json, 'googleMaps')
                        && Object.prototype.hasOwnProperty.call(val.gn_temp_data_json.googleMaps, 'markers')
                        && val.gn_temp_data_json.googleMaps.markers.length > 0) {
                        val.gn_temp_data_json.googleMaps.markers.map((mar) => {
                            const marker = {};
                            marker.location = mar.location;
                            marker.data = val;
                            markers.push(marker);
                            return true;
                        });
                    } else {
                        leadsToAsk.push(val);
                    }
                    return true;
                });
            }

            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                },
            };

            state[params.uuid].jsonData = params;
            state[params.uuid].markers = markers;
            state[params.uuid].leadsToAsk = leadsToAsk;
            state[params.uuid].googleMapsSetting.markers = state[params.uuid].markers;
            state[params.uuid].loading = false;

            return state;
        }
        case LEAD_UPDATE_DATA: {
            const markersUpdateData = [];
            const updateState = cloneDeep(state[params.uuid]);
            updateState.leadsInSaveing.map((element, idx) => {
                if (element.lead.id === params.id) {
                    updateState.leadsInSaveing.splice(idx, 1);
                    return element.lead;
                }
                return true;
            });

            if (updateState.leadsInSaveing.length === 0 && updateState.leadsToSave.length === 0) {
                updateState.leadsIsSaveing = false;
            }

            for (let i = 0; i < updateState.jsonData.Lead.length; i++) {
                if (params.updateData.id === updateState.jsonData.Lead[i].id) {
                    updateState.jsonData.Lead[i] = {
                        ...updateState.jsonData.Lead[i],
                        ...params.updateData,
                    };
                    break;
                }
            }

            updateState.jsonData.Lead.map((val) => {
                if (Object.prototype.hasOwnProperty.call(val.gn_temp_data_json, 'googleMaps')
                    && Object.prototype.hasOwnProperty.call(val.gn_temp_data_json.googleMaps, 'markers')
                    && val.gn_temp_data_json.googleMaps.markers.length > 0) {
                    val.gn_temp_data_json.googleMaps.markers.map((mar) => {
                        const marker = {};
                        marker.location = mar.location;
                        marker.data = val;
                        markersUpdateData.push(marker);
                        return true;
                    });
                }
                return true;
            });

            updateState.markers = markersUpdateData;
            updateState.googleMapsSetting.markers = updateState.markers;

            if (updateState.leadsToSave.length === 0
                || (!updateState.leadsIsSaveing && updateState.leadsInSaveing.length === 0)
            ) {
                updateState.workInProgress = false;
            }


            state = {
                ...state,
                [params.uuid]: updateState,
            };


            return state;
        }
        case SET_LEADS_ASKING: {
            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    leadsIsAsking: params.leadsIsAsking,
                },
            };
            return state;
        }
        case SET_LEAD_TO_ASK: {
            const leadsInAsking = cloneDeep(state[params.uuid].leadsInAsking);
            const leadsToAsk = cloneDeep(state[params.uuid].leadsToAsk);
            if (leadsInAsking.length < state[params.uuid].leadsToAskBuffor) {
                for (let i = 0; i <= state[params.uuid].leadsToAsk.length; i++) {
                    if (leadsInAsking.length >= state[params.uuid].leadsToAskBuffor) {
                        break;
                    }
                    const elm = leadsToAsk.splice(i, 1);
                    if (elm && elm[0]) {
                        leadsInAsking.push({ lead: elm[0], asking: false });
                    }
                }
            }

            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    leadsInAsking,
                    leadsToAsk,
                },
            };
            return state;
        }
        case SET_LEAD_IS_ASK: {
            const leadsInAsking = cloneDeep(state[params.uuid].leadsInAsking);
            Object.entries(leadsInAsking).forEach((element, idx) => {
                if (leadsInAsking[idx].lead && leadsInAsking[idx].lead.id === params.id) {
                    leadsInAsking[idx].asking = params.asking;
                }
            });
            state = {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    leadsInAsking,
                },
            };
            return state;
        }
        case ADDRESS_GEOCODING_BACK: {
            if (params.uuid) {
                const updateState = cloneDeep(state[params.uuid]);
                const markersGeoBack = [];
                const leadsToSavGeoBack = updateState.leadsToSave;
                const leadsNoAddressFoundGeoBack = updateState.leadsNoAddressFound;

                // Remove lead from to ask list
                let currentLead = updateState.leadsInAsking.find((element, idx) => {
                    if (element.lead.id === params.data.leadData.id) {
                        updateState.leadsInAsking.splice(idx, 1);
                    }
                    return element.lead.id === params.data.leadData.id;
                });
                if (currentLead) {
                    currentLead = currentLead.lead;
                }

                if (updateState.leadsInAsking.length === 0 && updateState.leadsToAsk.length === 0) {
                    updateState.leadsIsAsking = false;
                }

                if (params.data.status === 'OK' && currentLead) {
                    // Update lead
                    const markers = [];
                    for (let i = 0; i < params.data.results.length; i++) {
                        const marker = {};
                        marker.location = params.data.results[i].geometry.location;
                        markers.push(marker);
                    }
                    currentLead.gn_temp_data_json.googleMaps = {};
                    currentLead.gn_temp_data_json.googleMaps.markers = markers;
                    currentLead.gn_temp_data_json.googleMaps.zoom = 14;


                    // Add to lead to save list
                    leadsToSavGeoBack.push(currentLead);
                    Object.entries(updateState.jsonData.Lead).forEach((element, idx) => {
                        if (updateState.jsonData.Lead[idx].id === currentLead.id) {
                            updateState.jsonData.Lead[idx] = {
                                ...updateState.jsonData.Lead[idx],
                                ...currentLead,
                            };
                        }
                    });
                } else if (currentLead) {
                    // Add lead to not find address list
                    leadsNoAddressFoundGeoBack.push(currentLead);
                }

                // CHECK FOR NEW UPDATE
                updateState.jsonData.Lead.map((val) => {
                    if (Object.prototype.hasOwnProperty.call(val.gn_temp_data_json, 'googleMaps')
                        && Object.prototype.hasOwnProperty.call(val.gn_temp_data_json.googleMaps, 'markers')
                        && val.gn_temp_data_json.googleMaps.markers.length > 0) {
                        val.gn_temp_data_json.googleMaps.markers.map((mar) => {
                            const marker = {};
                            marker.location = mar.location;
                            marker.data = val;
                            markersGeoBack.push(marker);
                            return true;
                        });
                    }
                    return true;
                });
                updateState.markers = markersGeoBack;
                updateState.googleMapsSetting.markers = updateState.markers;

                if (updateState.leadsToAsk.length === 0
                    || (!updateState.leadsIsAsking && updateState.leadsInAsking.length === 0)
                ) {
                    updateState.workInProgress = false;
                }

                state = {
                    ...state,
                    [params.uuid]: updateState,
                };
            }
            return state;
        }
        default:
            return state;
    }
};
