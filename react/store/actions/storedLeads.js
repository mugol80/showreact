export const SET_STORED_LEADS_LIST = 'SET_STORED_LEADS_LIST';
export const GET_STORED_LEADS_LIST = 'GET_STORED_LEADS_LIST';
export const SET_SHOW_LIST_WINDOW_OPEN = 'SET_SHOW_LIST_WINDOW_OPEN';
export const getStoredLeadsList = (data) => ({ type: GET_STORED_LEADS_LIST, data });
export const setStoredLeadsList = (data) => ({ type: SET_STORED_LEADS_LIST, data });
export const setShowListWindowOpen = (data) => ({ type: SET_SHOW_LIST_WINDOW_OPEN, data });
