/* eslint no-param-reassign: [0] */
/* eslint no-underscore-dangle: ["error", { "allow": ["_action"] }] */

import { cloneDeep } from 'lodash';
import {
    GRID_REQUEST_DATA,
    GRID_RECEIVE_DATA,
    GRID_REQUEST_UPDATE,
    GRID_FULFILL_UPDATE,
    GRID_EDIT_DATA,
    GRID_UNDO_EDITS,
    GRID_CSV_GENERATE,
    GRID_CSV_RETURN,
    GRID_UPDATE_DATA,
} from '../actions/grid';

const initialState = {
    csvData: false,
};

export default (state = initialState, { type, params }) => {
    switch (type) {
        case GRID_REQUEST_DATA: {
            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    jsonData: {},
                    loading: true,
                },
            };
        }
        case GRID_RECEIVE_DATA: {
            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    jsonData: params,
                    loading: false,
                },
            };
        }
        case GRID_EDIT_DATA: {
            const updateData = [...state[params.uuid].updateData || []];

            const col = params.event.target.parentElement.attributes['data-col'].value;
            const id = params.event.target.parentElement.attributes['data-id'].value;

            // const { updateData } = state[params.uuid]; // This is the array of all things to change like in the state
            let updateDataEntry = {}; // This is the entry in the above array describing the row we want to change
            let alreadyExisted = {};

            const idOfUpdatedRow = id;

            // Clean implementation of searching objects in array by property thanks to ES6
            updateDataEntry = updateData.find((item) => item.id === idOfUpdatedRow) || {};

            alreadyExisted = !!updateDataEntry.id;

            // set the id in case we did not find it
            updateDataEntry.id = id;

            // Just set this everytime, even if it was set already
            updateDataEntry._action = 'update';

            // Then set the actual updated data from event
            updateDataEntry[col] = params.event.target.value;

            // Now need to put it back in the array of changed rows
            if (!alreadyExisted) { // If it wasn't present in the array of rows we can just add it
                updateData.push(updateDataEntry);
            } else { // Else we have to find the old entry and update it
                updateData.map((data) => {
                    if (data.id === updateDataEntry.id) {
                        data = updateDataEntry;
                    }
                    return false;
                });
            }

            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    updateData: [...state[params.uuid].updateData || []],
                },
            };
        }
        case GRID_UNDO_EDITS: {
            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    updateData: [],
                },
            };
        }
        case GRID_REQUEST_UPDATE: {
            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    updating: true,
                },
            };
        }
        case GRID_FULFILL_UPDATE: {
            // Update the jsonData from updateData
            const jsonData = {};
            Object.entries(state[params.uuid].updateData).forEach((upd) => {
                Object.entries(state[params.uuid].jsonData[params.modelName]).forEach((d) => {
                    if (upd.id === d.id) {
                        Object.entries(state[params.uuid].jsonData[params.modelName]).forEach((prop) => {
                            jsonData[params.modelName] = {
                                ...state[params.uuid].jsonData[params.modelName],
                                [prop]: upd[prop],
                            };
                        });
                    }
                });
            });
            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    updateData: [],
                    updating: false,
                    jsonData: {
                        ...state[params.uuid].jsonData[params.modelName],
                        jsonData,
                    },
                },
            };
        }
        case GRID_CSV_GENERATE: {
            return {
                ...state,
                csvData: false,
            };
        }
        case GRID_CSV_RETURN: {
            return {
                ...state,
                csvData: params,
            };
        }
        case GRID_UPDATE_DATA: {
            const updateState = cloneDeep(state[params.uuid].jsonData[params.modelName]);

            for (let i = 0; i < updateState.length; i++) {
                if (params.updateData.id === updateState[i].id) {
                    updateState[i] = {
                        ...updateState[i],
                        ...params.updateData,
                    };
                    break;
                }
            }

            return {
                ...state,
                [params.uuid]: {
                    ...state[params.uuid],
                    jsonData: {
                        ...state[params.uuid].jsonData,
                        [params.modelName]: updateState,
                    },
                },
            };
        }
        default:
            return state;
    }
};
