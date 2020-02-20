export const GRID_REQUEST_DATA = 'GRID_REQUEST_DATA';
export const GRID_RECEIVE_DATA = 'GRID_RECEIVE_DATA';

export const GRID_EDIT_DATA = 'GRID_EDIT_DATA';
export const GRID_UNDO_EDITS = 'GRID_UNDO_EDITS';

export const GRID_REQUEST_UPDATE = 'GRID_REQUEST_UPDATE';
export const GRID_FULFILL_UPDATE = 'GRID_FULFILL_UPDATE';

export const GRID_CSV_GENERATE = 'GRID_CSV_GENERATE';
export const GRID_CSV_RETURN = 'GRID_CSV_RETURN';

export const GRID_UPDATE_DATA = 'GRID_UPDATE_DATA';

export const gridRequestData = (params) => ({ type: GRID_REQUEST_DATA, params });
export const gridReceiveData = (params) => ({ type: GRID_RECEIVE_DATA, params });

export const gridUndoEdits = (params) => ({ type: GRID_UNDO_EDITS, params });
export const gridEditData = (params) => ({ type: GRID_EDIT_DATA, params });

export const gridRequestUpdate = (params) => ({ type: GRID_REQUEST_UPDATE, params });
export const gridFulfillUpdate = (params) => ({ type: GRID_FULFILL_UPDATE, params });

export const gridCsvGenerate = (params) => ({ type: GRID_CSV_GENERATE, params });
export const gridCsvReturn = (params) => ({ type: GRID_CSV_RETURN, params });

export const gridUpdateData = (params) => ({ type: GRID_UPDATE_DATA, params });
