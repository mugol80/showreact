export const GET_CONTENTS = 'GET_CONTENTS';
export const LIST_CONTENTS = 'LIST_CONTENTS';
export const SET_CONTENT = 'SET_CONTENT';
export const SET_SHOW_CONTENT = 'SET_SHOW_CONTENT';
export const SET_IN_PROGRESS = 'SET_IN_PROGRESS';

export const getContents = (data) => ({ type: GET_CONTENTS, data });
export const listContents = (data) => ({ type: LIST_CONTENTS, data });
export const setContent = (data) => ({ type: SET_CONTENT, data });
export const setInProgress = (data) => ({ type: SET_IN_PROGRESS, data });
export const setShowContent = (data) => ({ type: SET_SHOW_CONTENT, data });
