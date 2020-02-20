export const OPEN_ALERT = 'OPEN_ALERT';
export const CLOSE_ALERT = 'CLOSE_ALERT';

export const openAlert = (data) => ({ type: OPEN_ALERT, data });
export const closeAlert = () => ({ type: CLOSE_ALERT });
