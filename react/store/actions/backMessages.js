export const BACK_MESSAGES = 'BACK_MESSAGES';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export const backMessages = (data) => ({ type: BACK_MESSAGES, data });
export const clearMessages = (data) => ({ type: CLEAR_MESSAGES, data });
