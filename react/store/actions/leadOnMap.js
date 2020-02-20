export const GET_LEADS_LIST = 'GET_LEADS_LIST';
export const RECEIVE_LEADS_LIST = 'RECEIVE_LEADS_LIST';
export const WORK_IN_PROGRESS_LEAD_ON_MAP = 'WORK_IN_PROGRESS_LEAD_ON_MAP';
export const SET_LEADS_SAVING = 'SET_LEADS_SAVING';
export const SET_LEAD_TO_SAVE = 'SET_LEAD_TO_SAVE';
export const SET_LEAD_IS_SAVE = 'SET_LEAD_IS_SAVE';

export const SET_LEADS_ASKING = 'SET_LEADS_ASKING';
export const SET_LEAD_TO_ASK = 'SET_LEAD_TO_ASK';
export const SET_LEAD_IS_ASK = 'SET_LEAD_IS_ASK';

export const LEAD_UPDATE_DATA = 'LEAD_UPDATE_DATA';

export const getLeadsList = (params) => ({ type: GET_LEADS_LIST, params });
export const receiveLeadsList = (params) => ({ type: RECEIVE_LEADS_LIST, params });
export const workInProgressLeadOnMap = (params) => ({ type: WORK_IN_PROGRESS_LEAD_ON_MAP, params });
export const setLeadsSaveing = (params) => ({ type: SET_LEADS_SAVING, params });
export const setLeadToSave = (params) => ({ type: SET_LEAD_TO_SAVE, params });
export const setLeadIsSave = (params) => ({ type: SET_LEAD_IS_SAVE, params });

export const setLeadsAsking = (params) => ({ type: SET_LEADS_ASKING, params });
export const setLeadToAsk = (params) => ({ type: SET_LEAD_TO_ASK, params });
export const setLeadIsAsk = (params) => ({ type: SET_LEAD_IS_ASK, params });

export const leadUpdateData = (params) => ({ type: LEAD_UPDATE_DATA, params });
