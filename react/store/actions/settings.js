export const SET_SETTINGS_VALUE = 'SET_SETTINGS_VALUE';
export const GET_FAIRS_LIST = 'GET_FAIRS_LIST';
export const SET_IN_PROGRESS = 'SET_IN_PROGRESS';
export const SAVE_FAIR = 'SAVE_FAIR';
export const setSettingValue = (data) => ({ type: SET_SETTINGS_VALUE, data });
export const getFairsList = () => ({ type: GET_FAIRS_LIST });
export const setInProgress = (data) => ({ type: SET_IN_PROGRESS, data });
export const saveFair = (data) => ({ type: SAVE_FAIR, data });
